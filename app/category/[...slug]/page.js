import ProductModel from '@/model/ProductModel'
import Categorymodel from '@/model/Categorymodel'
import ConnectToDB from '@/app/lib/mongodb'
import Productswrapper from '@/components/templates/productswrapper/Productswrapper'
import { notFound } from 'next/navigation'
import Navbar from '@/components/templates/navbar/Navbar'
import Headermobile from '@/components/modules/headermobile/Headermobile'
import { Getbanners } from '@/components/utils/helperServer'
import GeneralModel from '@/model/GeneralModel'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mahshopsite.ir'

async function getCategoryFromPath (slugs) {
  await ConnectToDB()

  let parentId = null
  let category = null

  for (const slug of slugs) {
    category = await Categorymodel.findOne({
      slug,
      isActive: true,
      parent: parentId
    })
      .lean()
      .exec()

    if (!category) {
      return null
    }

    parentId = category._id
  }

  return category
}

async function getAllCategoryIds (categoryId) {
  const categoryIds = [categoryId]

  let parentIds = [categoryId]

  while (parentIds.length > 0) {
    const children = await Categorymodel.find({
      parent: {
        $in: parentIds
      },
      isActive: true
    })
      .select('_id')
      .lean()
      .exec()

    if (children.length === 0) {
      break
    }

    const childIds = children.map(category => category._id)

    categoryIds.push(...childIds)

    parentIds = childIds
  }

  return categoryIds
}

function getCategoryUrl (slugs) {
  return `${SITE_URL}/category/${slugs
    .map(slug => encodeURIComponent(slug))
    .join('/')}`
}

function getProductUrl (slug) {
  return `${SITE_URL}/products/${encodeURIComponent(slug)}`
}

export async function generateMetadata ({ params }) {
  const { slug } = await params

  const category = await getCategoryFromPath(slug)

  if (!category) {
    return {
      title: 'دسته‌بندی پیدا نشد',

      robots: {
        index: false,
        follow: false
      }
    }
  }

  const categoryName = category.name

  const title = `خرید ${categoryName} | جدیدترین محصولات ${categoryName}`

  const description =
    category.description?.trim() ||
    `مشاهده و خرید جدیدترین محصولات ${categoryName} با تنوع بالا و بهترین قیمت از فروشگاه ما.`

  const canonicalUrl = getCategoryUrl(slug)

  const imageUrl = category.image
    ? category.image.startsWith('http')
      ? category.image
      : `${SITE_URL}${category.image}`
    : null

  return {
    title,

    description,

    robots: {
      index: true,
      follow: true
    },

    alternates: {
      canonical: canonicalUrl
    },

    openGraph: {
      title,

      description,

      url: canonicalUrl,

      siteName: 'نام فروشگاه شما',

      locale: 'fa_IR',

      type: 'website',

      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: categoryName
          }
        ]
      })
    },

    twitter: {
      card: 'summary_large_image',

      title,

      description,

      ...(imageUrl && {
        images: [imageUrl]
      })
    }
  }
}

export default async function Page ({ params }) {
  const banners = await Getbanners()
  let logoData = await GeneralModel.findOne(
    {},
    { siteLogo: 1, siteName: 1 }
  ).lean()
  const logo = JSON.parse(JSON.stringify(logoData))
  const { slug } = await params

  const category = await getCategoryFromPath(slug)

  if (!category) {
    notFound()
  }

  const categoryIds = await getAllCategoryIds(category._id)

  const products = await ProductModel.find({
    category: {
      $in: categoryIds
    },

    isActive: true
  })
    .populate('category')
    .sort({
      createdAt: -1
    })
    .lean()
    .exec()

  const canonicalUrl = getCategoryUrl(slug)

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'خانه',
      item: SITE_URL
    },

    {
      '@type': 'ListItem',
      position: 2,
      name: 'فروشگاه',
      item: `${SITE_URL}/products`
    }
  ]

  let currentPath = []

  for (let i = 0; i < slug.length; i++) {
    currentPath.push(slug[i])

    const currentCategory = await getCategoryFromPath(currentPath)

    if (!currentCategory) {
      continue
    }

    breadcrumbItems.push({
      '@type': 'ListItem',

      position: breadcrumbItems.length + 1,

      name: currentCategory.name,

      item: getCategoryUrl(currentPath)
    })
  }

  const jsonLd = {
    '@context': 'https://schema.org',

    '@graph': [
      {
        '@type': 'CollectionPage',

        '@id': `${canonicalUrl}#webpage`,

        url: canonicalUrl,

        name: category.name,

        description: category.description?.trim() || `محصولات ${category.name}`,

        inLanguage: 'fa-IR',

        isPartOf: {
          '@type': 'WebSite',

          name: 'ماه شاپ',

          url: SITE_URL
        },

        mainEntity: {
          '@id': `${canonicalUrl}#products`
        }
      },

      {
        '@type': 'BreadcrumbList',

        '@id': `${canonicalUrl}#breadcrumb`,

        itemListElement: breadcrumbItems
      },

      {
        '@type': 'ItemList',

        '@id': `${canonicalUrl}#products`,

        name: `محصولات ${category.name}`,

        numberOfItems: products.length,

        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',

          position: index + 1,

          url: getProductUrl(product.slug)
        }))
      }
    ]
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
        }}
      />

      <Navbar />

      <Headermobile logo={logo} banners={banners} />
      <main>
        <Productswrapper
          products={JSON.parse(JSON.stringify(products))}
          totalProducts={products.length}
        />
      </main>
    </>
  )
}
