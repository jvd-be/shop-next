'use client'

import { useEffect, useState, useContext, createContext, useMemo } from 'react'

const cartContext = createContext()

export default function CartProvider ({ children, isLoggedIn = false }) {
  const [items, setItems] = useState([])

  const [loading, setLoading] = useState(false)

  const [mounted, setMounted] = useState(false)

  const readLocal = () => {
    try {
      const store = localStorage.getItem('cart')

      return store ? JSON.parse(store) : []
    } catch {
      return []
    }
  }
  const syncCart = async items => {
    try {
      const res = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })

      const data = await res.json()

      if (data.items) {
        setItems(data.items)
        if (!isLoggedIn) {
          writeLocalCart(data.items)
        }
      }
    } catch (e) {
      console.error('cart sync error', e)
    }
  }

  const writeLocalCart = data => {
    localStorage.setItem('cart', JSON.stringify(data))
  }

  const addToCart = async ({ product, selectedVariant, qty = 1 }) => {
    const productId = String(product._id)

    // fallback اگر variant _id نداشت
    const variantId = selectedVariant?._id
      ? String(selectedVariant._id)
      : `${selectedVariant.color}-${selectedVariant.size}`

    const stock = Number(selectedVariant.quantity) || 0

    if (qty > stock) {
      alert('موجودی کافی نیست')
      return
    }

    // guest cart
    if (!isLoggedIn) {
      const localItems = readLocal()

      const existingIndex = localItems.findIndex(
        item =>
          String(item.productId) === productId &&
          String(item.variantId) === variantId
      )

      let updated = [...localItems]

      if (existingIndex !== -1) {
        const newQuantity = updated[existingIndex].quantity + qty

        if (newQuantity > stock) {
          alert('موجودی کافی نیست')
          return
        }

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQuantity,
          stock
        }
      } else {
        updated.push({
          productId,
          variantId,

          title: product.title,

          image: product.images?.[0] || null,

          // مدل جدید
          price: product.finalPrice,

          oldPrice: product.price,

          discount: product.discount,

          color: selectedVariant.color,

          colorName: selectedVariant.colorName,

          size: selectedVariant.size,

          quantity: qty,
          stock
        })
      }

      writeLocalCart(updated)
      setItems(updated)

      return
    }

    // user cart
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          variantId,
          quantity: qty
        })
      })

      const data = await res.json()

      if (res.ok) {
        setItems(data.items || [])
      }
    } catch (err) {
      console.error('addToCart error', err)
    }
  }

  const removeFromCart = async ({ productId, variantId }) => {
    if (!isLoggedIn) {
      setItems(prev => {
        const updated = prev.filter(
          item =>
            !(
              String(item.productId) === String(productId) &&
              String(item.variantId) === String(variantId)
            )
        )

        writeLocalCart(updated)

        return updated
      })

      return
    }

    try {
      const res = await fetch('/api/cart/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          variantId
        })
      })

      if (!res.ok) return

      const data = await res.json()

      setItems(data.items || [])
    } catch (err) {
      console.error('removeFromCart error', err)
    }
  }

const updateQuantity = async ({ productId, variantId, quantity }) => {
  if (quantity <= 0) {
    return removeFromCart({
      productId,
      variantId
    })
  }

  // guest
  if (!isLoggedIn) {
    const updated = items.map(item => {
      if (
        String(item.productId) === String(productId) &&
        String(item.variantId) === String(variantId)
      ) {
        const safeQty = Math.min(quantity, item.stock)

        return {
          ...item,
          quantity: safeQty
        }
      }

      return item
    })

    setItems(updated)
    writeLocalCart(updated)
    return
  }

  // user
  try {
    const res = await fetch('/api/cart/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId,
        variantId,
        quantity
      })
    })

    if (res.ok) {
      setItems(prev =>
        prev.map(item =>
          String(item.productId) === String(productId) &&
          String(item.variantId) === String(variantId)
            ? { ...item, quantity }
            : item
        )
      )
    }
  } catch (err) {
    console.error('updateQuantity error', err)
  }
}


  const cartCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + item.quantity * item.price
    }, 0)
  }, [items])

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true)

      if (!isLoggedIn) {
        const localItems = readLocal()

        if (localItems.length > 0) {
          await syncCart(localItems)
        } else {
          setItems([])
        }

        setLoading(false)
        return
      }

      const guestCart = readLocal()

      try {
        let res
        const alreadyMerged = sessionStorage.getItem('cartMerged')

        if (guestCart.length > 0 && !alreadyMerged) {
          sessionStorage.setItem('cartMerged', 'true')

          const backupCart = [...guestCart]

          // مهم: جلوگیری از merge دوباره
          localStorage.removeItem('cart')

          try {
            res = await fetch('/api/cart/merge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: guestCart })
            })

            const data = await res.json()

            if (data.success) {
              setItems(data.items || [])
            }
          } catch (err) {
            // restore
            writeLocalCart(backupCart)
            throw err
          }
        } else {
          res = await fetch('/api/cart/get')

          const data = await res.json()

          const serverItems = data.items || []
          setItems(serverItems)

          if (serverItems.length > 0) {
            await syncCart(serverItems)
          } else {
            setItems([])
          }
        }
      } catch (err) {
        console.error('cart load error', err)

        setItems(readLocal())
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [isLoggedIn])

  useEffect(() => {
    setMounted(true)
  }, [])

  const values = useMemo(() => {
    return {
      items,
      addToCart,
      loading,
      removeFromCart,
      updateQuantity,
      cartCount,
      cartTotal,
      mounted
    }
  }, [items, loading, cartCount, cartTotal, mounted])

  return <cartContext.Provider value={values}>{children}</cartContext.Provider>
}

export const useCart = () => useContext(cartContext)
