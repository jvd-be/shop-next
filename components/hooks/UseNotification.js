"use client"
import { useState } from "react"
export function UseNotification() {
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    title: ''
  })

  const showNotification = (type, title) => {
    setNotification({
      show: true,
      type,
      title
    })

    setTimeout(() => {
      setNotification(prev => ({
        ...prev,
        show: false
      }))
    }, 3000)
  }

  return {
    notification,
    showNotification
  }
}
