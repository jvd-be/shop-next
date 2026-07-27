import ConnectToDB from '@/app/lib/mongodb'
import Footer from '@/components/templates/footer/Footer'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Navbar from '@/components/templates/navbar/Navbar'
import Productpagewrapper from '@/components/templates/productpagewrapper/Productpagewrapper'
import { getAuthFromCookies } from '@/components/utils/authServer'
import ProductModel from '@/model/ProductModel'
import Reviewmodel from '@/model/Reviewmodel'
import Usermodel from '@/model/Usermodel'
import { notFound } from 'next/navigation'
import React from 'react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteName = 'فروشگاه'

function getAbsoluteUrl (path) {
  if (!path) return `${siteUrl}/images/og-default.jpg`
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

function normalizeDescription (description, fallback) {
  const text = description?.replace(/<[^>]*>/g, '').trim() || fallback
  return text.length > 155 ? `${text.slice(0, 152)}...` : text
}

async function getProductBySlug (slug, includeInactive = false) {
  await ConnectToDB()

  const query = includeInactive ? { slug } : { slug, isActive: true }

  return ProductModel.findOne(query).populate('category').lean()
}

export async function generateMetadata ({ params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug, true)

  if (!product || product.isActive === false) {
    return {
      title: 'محصول یافت نشد',
      description: 'محصول مورد نظر یافت نشد یا در حال حاضر غیرفعال است.',
      robots: {
        index: false,
        follow: false
      }
    }
  }

  const productUrl = `${siteUrl}/products/${product.slug}`
  const title = `${product.title} | ${siteName}`
  const description = normalizeDescription(
    product.description,
    `خرید ${product.title} با بهترین قیمت از ${siteName}`
  )

  const imageUrl = getAbsoluteUrl(product.images?.[0])

  return {
    title,
    description,
    alternates: {
      canonical: productUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName,
      type: 'website',
      locale: 'fa_IR',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  }
}

async function Productpage ({ params }) {
  const { slug } = await params
  const { isLoggedIn, user } = await getAuthFromCookies()

 let productData = null
let userData = null
let reviewData = []

try {
  await ConnectToDB()

  if (isLoggedIn && user?.userId) {
    userData = await Usermodel.findById(user.userId.toString())
      .populate('wishlist')
      .lean()
  }

  productData = await ProductModel.findOne({ slug, isActive: true })
    .populate('category')
    .lean()

} catch (error) {
  console.error('خطا در دریافت دیتای سمت سرور:', error)
  notFound()   // اگر خطای دیتابیس بود مستقیم 404
}

if (!productData) {
  notFound()
}

reviewData = await Reviewmodel.find({
  product: productData._id,
  isApproved: true
})
  .populate('user', 'name avatar')
  .sort({ createdAt: -1 })
  .lean()


  const product = JSON.parse(JSON.stringify(productData))
  const review = JSON.parse(JSON.stringify(reviewData || []))
  const finaluser = isLoggedIn
    ? JSON.parse(JSON.stringify(userData || null))
    : null

  const isWishListed =
    finaluser?.wishlist?.some(
      item => String(item?._id || item) === String(product?._id)
    ) || false

  const productUrl = `${siteUrl}/products/${product.slug}`

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: normalizeDescription(
      product.description,
      `خرید ${product.title} از ${siteName}`
    ),
    image: product.images?.length
      ? product.images.map(image => getAbsoluteUrl(image))
      : [getAbsoluteUrl()],
    sku: product._id,
    category: product.category?.name,
    brand: {
      '@type': 'Brand',
      name: siteName
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'IRR',
      price: product.finalPrice || product.price,
      availability:
        product.totalQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    },
    aggregateRating:
      product.averageRating > 0 && review.length > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.averageRating,
            reviewCount: review.length,
            bestRating: 5,
            worstRating: 1
          }
        : undefined,
    review: review.map(item => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: item.user?.name || 'کاربر'
      },
      reviewBody: item.comment || item.text || '',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: item.rating,
        bestRating: 5,
        worstRating: 1
      },
      datePublished: item.createdAt
    }))
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'خانه',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'محصولات',
        item: `${siteUrl}/products`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category?.name || 'دسته‌بندی',
        item: product.category?.slug
          ? `${siteUrl}/categories/${product.category.slug}`
          : `${siteUrl}/products`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.title,
        item: productUrl
      }
    ]
  }

  return (
    <div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />

      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd)
        }}
      />

      <Navbar />
      <Menumobile />

      <Productpagewrapper
        user={user}
        product={product}
        isWishListed={isWishListed}
        review={review}
      />

      <Footer />
    </div>
  )
}

export default Productpage
