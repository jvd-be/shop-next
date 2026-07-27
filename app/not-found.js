import Link from 'next/link'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export const metadata = {
  title: 'صفحه پیدا نشد',
  description: 'صفحه‌ای که به دنبال آن هستید پیدا نشد یا حذف شده است.',
  robots: {
    index: false,
    follow: false
  }
}

export default function NotFound () {
  return (
    <main className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 px-4 dark:bg-gray-900'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]' />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] opacity-20" />

      <section className='relative z-10 w-full max-w-lg animate-fade-in-up space-y-8 text-center'>
        <div className='relative'>
          <h1 className='select-none text-[8rem] font-black leading-none tracking-tighter text-gray-900 duration-1000 animate-pulse dark:text-white sm:text-[14rem]'>
            404
          </h1>
          <div className='pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[80px]' />
        </div>

        <div className='space-y-4'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-4xl'>
            صفحه‌ای که دنبالش هستید، اینجا نیست!
          </h2>
          <p className='text-lg leading-relaxed text-gray-500 dark:text-gray-400'>
            به نظر می‌رسد این صفحه گم شده یا حذف شده است. از دکمه زیر می‌توانید به صفحه اصلی برگردید.
          </p>
        </div>

        <div className='flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row'>
          <Link
            href='/'
            className='group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 sm:w-auto'
            aria-label='بازگشت به صفحه اصلی'
          >
            <FiHome className='h-5 w-5' aria-hidden='true' />
            بازگشت به خانه
            <FiArrowLeft className='h-5 w-5 transition-transform group-hover:-translate-x-1' aria-hidden='true' />
          </Link>
        </div>
      </section>

      <p className='absolute bottom-8 text-sm font-medium text-gray-400 dark:text-gray-600'>
        کد خطا: 404 • صفحه غیرموجود
      </p>
    </main>
  )
}
