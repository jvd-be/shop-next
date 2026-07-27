import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserEdit, FaCalendarAlt } from 'react-icons/fa';

const Fashioncard = ({ post }) => {
  const dateObject = new Date(post.createdAt);
  
  // تاریخ فرمت‌شده فارسی برای کاربر
  const formattedDate = !isNaN(dateObject.getTime()) 
    ? dateObject.toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'تاریخ نامشخص';

  // تاریخ با فرمت ISO استاندارد برای موتورهای جستجو
  const isoDate = !isNaN(dateObject.getTime()) ? dateObject.toISOString() : '';

  return (
    <article 
      itemScope 
      itemType="https://schema.org/BlogPosting"
      className='group relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-300 shadow-sm hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500'
    >
      
      {/* لینک سراسری و پوشاننده روی کل کارت */}
      <Link 
        href={`/blogs/${post.slug || post._id}`} 
        className='absolute inset-0 z-10'
        itemProp="url"
      >
        <span className='sr-only'>{post.title}</span> 
      </Link>

      {/* تصویر مقاله با میکرودیتای مخصوص گوگل */}
      <div className='relative w-full aspect-16/10 overflow-hidden bg-gray-100 dark:bg-gray-700'>
        <Image
          itemProp="image"
          src={post.coverImage || '/default-cover.png'}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className='object-cover transition-transform duration-700 group-hover:scale-105'
          priority={false} // تصاویر کارت‌ها به صورت Lazy لود شوند تا سرعت اولیه صفحه بالا برود
        />
      </div>

      {/* محتوای کارت */}
      <div className='flex flex-col grow p-5'>
        
        {/* اطلاعات متادیتا */}
        <div className='flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-3'>
          
          {/* نویسنده */}
          <div 
            className='flex items-center gap-1' 
            itemProp="author" 
            itemScope 
            itemType="https://schema.org/Person"
          >
            <FaUserEdit aria-hidden="true" />
            <span itemProp="name">{post.author || 'نویسنده'}</span>
          </div>

          {/* تاریخ انتشار استاندارد */}
          <div className='flex items-center gap-1'>
            <FaCalendarAlt aria-hidden="true" />
            {isoDate ? (
              <time itemProp="datePublished" dateTime={isoDate}>
                {formattedDate}
              </time>
            ) : (
              <span>{formattedDate}</span>
            )}
          </div>
        </div>

        {/* عنوان مقاله (تبدیل به H3 برای رعایت سلسله‌مراتب سئو) */}
        <h3 
          itemProp="headline" 
          className='text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug line-clamp-2'
        >
          {post.title}
        </h3>

        {/* توضیحات کوتاه */}
        <p 
          itemProp="description" 
          className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed grow'
        >
          {post.description}
        </p>

        {/* دکمه راهنما */}
        <div className='mt-auto pt-4 border-t border-gray-50 dark:border-gray-700'>
          <span className='inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors'>
            مطالعه بیشتر
          </span>
        </div>
      </div>
    </article>
  );
};

export default Fashioncard;
