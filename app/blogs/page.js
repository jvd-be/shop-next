import Blogswrapper from '@/components/templates/blogswrapper/Blogswrapper'
import Footer from '@/components/templates/footer/Footer'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Navbar from '@/components/templates/navbar/Navbar'
import Blogmodel from '@/model/Blogmodel'
import ConnectToDB from '../lib/mongodb'
import Headermobile from '@/components/modules/headermobile/Headermobile'
import { Getbanners } from '@/components/utils/helperServer'
import GeneralModel from '@/model/GeneralModel'
export const metadata = {
  title: 'وبلاگ مد و لباس | جدیدترین ترندها و استایل‌ها',
  description:
    'جدیدترین مقالات در حوزه مد، فشن، طراحی لباس و استایل‌های مدرن را در وبلاگ ما بخوانید.',
  alternates: {
    canonical: '/blogs'
  },
  openGraph: {
    title: 'وبلاگ مد و لباس',
    description: 'جدیدترین مقالات مد و فشن',
    type: 'website'
  }
}

export default async function Blogs () {
  let blogs = []
  try {
    await ConnectToDB()
    const blogsData = await Blogmodel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean()

    blogs = JSON.parse(JSON.stringify(blogsData))
  } catch (error) {
    console.error('Error fetching blogs:', error)
  }
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'وبلاگ مد و لباس و فشن',
    description:
      'مجموعه‌ای از جدیدترین مقالات، راهنماها و آموزش‌های حوزه مد، پوشاک و استایل روز دنیا.',
    url: 'https://yourdomain.com/blogs'
  }

  let logoData = null
  try {
    logoData = await GeneralModel.findOne(
      {},
      { siteLogo: 1, siteName: 1 }
    ).lean()
  } catch (error) {}
  const logo = JSON.parse(JSON.stringify(logoData))
const bannersData = await Getbanners()
const banners = bannersData ?? []


  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <Headermobile logo={logo} banners={banners} />
      <Menumobile />
      <header className='sr-only'>
        <h1>وبلاگ مد و لباس و راهنمای استایل فشن</h1>
        <p>مرجع مقالات تخصصی طراحی لباس، ترندهای سال و ست کردن پوشاک</p>
      </header>
      <main className='grow'>
        {blogs.length === 0 ? (
          <div className='text-center py-20 text-gray-500 dark:text-gray-400'>
            <p className='text-lg font-medium'>
              مقاله‌ای در حال حاضر یافت نشد.
            </p>
            <p className='text-sm mt-2'>لطفاً بعداً مراجعه نمایید.</p>
          </div>
        ) : (
          <Blogswrapper blogs={blogs} />
        )}
      </main>
      <Footer />
    </>
  )
}
