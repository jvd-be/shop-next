import { notFound } from 'next/navigation'

import ConnectToDB from '@/app/lib/mongodb'
import Blogmodel from '@/model/Blogmodel'
import GeneralModel from '@/model/GeneralModel'

import Navbar from '@/components/templates/navbar/Navbar'
import Footer from '@/components/templates/footer/Footer'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Headermobile from '@/components/modules/headermobile/Headermobile'
import Blogpagewrapper from '@/components/templates/blogpagewrapper/Blogpagewrapper'

async function getPageData (slug) {
  await ConnectToDB()

  const [blog, general, relatedPosts] = await Promise.all([
    Blogmodel.findOne({
      slug,
      isActive: true
    }).lean(),

    GeneralModel.findOne().lean(),

    Blogmodel.find({
      slug: { $ne: slug },
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()
  ])

  return {
    blog,
    general,
    relatedPosts
  }
}

export async function generateMetadata ({ params }) {
  const { slug } = await params

  const { blog, general } = await getPageData(slug)

  if (!blog) {
    return {
      title: 'مقاله یافت نشد',
      robots: {
        index: false,
        follow: false
      }
    }
  }

  const siteUrl = (general.siteUrl || '').replace(/\/$/, '')
  const siteName = general.siteName

  const title = general.titleFormat
    ? general.titleFormat
        .replace('%pageTitle%', blog.title)
        .replace('%siteName%', siteName)
    : `${blog.title} | ${siteName}`

  const description = blog.description || general.siteDescription || blog.title

  const image = blog.coverImage
    ? `${siteUrl}${blog.coverImage}`
    : `${siteUrl}${general.defaultOgImage}`

  return {
    metadataBase: new URL(siteUrl),

    title,

    description,

    applicationName: siteName,

    creator: blog.author,

    publisher: siteName,

    authors: [
      {
        name: blog.author
      }
    ],

    alternates: {
      canonical: `/blogs/${blog.slug}`
    },

    keywords: [
      blog.title,
      siteName,
      'مد',
      'استایل',
      'لباس',
      'پوشاک',
      'فروشگاه لباس'
    ],

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
      type: 'article',

      locale: 'fa_IR',

      url: `${siteUrl}/blogs/${blog.slug}`,

      siteName,

      title,

      description,

      publishedTime: blog.createdAt,

      modifiedTime: blog.updatedAt,

      authors: [blog.author],

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title
        }
      ]
    },

    twitter: {
      card: 'summary_large_image',

      creator: general.twitterHandle,

      title,

      description,

      images: [image]
    },

    icons: {
      icon: general.favicon,
      shortcut: general.favicon,
      apple: general.favicon
    }
  }
}

export default async function Blog ({ params }) {
  const { slug } = await params

  const { blog, general, relatedPosts } = await getPageData(slug)

  if (!blog) {
    notFound()
  }

  const siteUrl = general.siteUrl.replace(/\/$/, '')

  const articleSchema = {
    '@context': 'https://schema.org',

    '@type': 'Article',

    headline: blog.title,

    alternativeHeadline: blog.title,

    description: blog.description,

    articleBody: blog.body?.map(item => item.subDescription).join(' ') || '',

    image: {
      '@type': 'ImageObject',

      url: `${siteUrl}${blog.coverImage}`,

      width: 1200,

      height: 630
    },

    author: {
      '@type': 'Person',

      name: blog.author
    },

    publisher: {
      '@type': 'Organization',

      name: general.siteName,

      logo: {
        '@type': 'ImageObject',

        url: `${siteUrl}${general.siteLogo}`
      }
    },

    url: `${siteUrl}/blogs/${blog.slug}`,

    datePublished: blog.createdAt,

    dateModified: blog.updatedAt,

    articleSection: 'Fashion',

    inLanguage: 'fa-IR',

    mainEntityOfPage: {
      '@type': 'WebPage',

      '@id': `${siteUrl}/blogs/${blog.slug}`
    }
  }

  const organizationSchema = {
    '@context': 'https://schema.org',

    '@type': 'Organization',

    name: general.siteName,

    url: siteUrl,

    logo: `${siteUrl}${general.siteLogo}`,

    image: `${siteUrl}${general.defaultOgImage}`,

    sameAs: []
  }

  const websiteSchema = {
    '@context': 'https://schema.org',

    '@type': 'WebSite',

    name: general.siteName,

    url: siteUrl,

    description: general.siteDescription,

    inLanguage: 'fa-IR',

    potentialAction: {
      '@type': 'SearchAction',

      target: `${siteUrl}/search?q={search_term_string}`,

      'query-input': 'required name=search_term_string'
    }
  }

  const breadcrumbSchema = {
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

        name: 'وبلاگ',

        item: `${siteUrl}/blogs`
      },

      {
        '@type': 'ListItem',

        position: 3,

        name: blog.title,

        item: `${siteUrl}/blogs/${blog.slug}`
      }
    ]
  }

  const structuredData = [
    organizationSchema,
    websiteSchema,
    breadcrumbSchema,
    articleSchema
  ]

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      <div className='flex min-h-screen flex-col'>
        <Navbar />

        <Headermobile />

        <Menumobile />

        <main className='grow'>
          <Blogpagewrapper
            Blog={JSON.parse(JSON.stringify(blog))}
            relatedPosts={JSON.parse(JSON.stringify(relatedPosts))}
          />
        </main>

        <Footer />
      </div>
    </>
  )
}
