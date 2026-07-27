import Image from 'next/image'
import Link from 'next/link'
import { FaShoppingBag, FaStar, FaRegHeart, FaHeart } from 'react-icons/fa'

export default function Productcard ({
  product,
  onToggleWishlist,
  isWishlisted,
  handleAddToCart
}) {
  const {
    _id,
    title,
    slug,
    price,
    finalPrice,
    discount = 0,
    images = [],
    averageRating = 0
  } = product
  const uniqueVariants = product.variants.filter(
    (variant, index, self) =>
      index === self.findIndex(item => item.color === variant.color)
  )

  const image = images?.[0] || '/images/no-image.png'
  const rating = averageRating || 0
  const hasDiscount = discount > 0

  return (
    <>
      <article className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900'>
        <div className='relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800'>
          <Link href={`/products/${slug}`} className='block h-full w-full'>
            <Image
              src={image}
              alt={title}
              fill
              sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
          </Link>

          {hasDiscount && (
            <span className='absolute top-2 right-2 z-20 rounded-md bg-red-500 px-1.5 py-1 text-[10px] font-bold text-white shadow-sm sm:px-2 sm:text-xs'>
              {discount}٪
            </span>
          )}

          <button
            type='button'
            onClick={() => onToggleWishlist?.(_id)}
            className={`absolute top-2 left-2 z-20 rounded-full p-2 shadow-md backdrop-blur-sm transition ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-600 dark:bg-gray-800/90 dark:text-gray-300'
            }`}
            aria-label='افزودن به علاقه‌مندی‌ها'
          >
            {isWishlisted ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
          </button>
        </div>

        <div className='flex flex-1 flex-col gap-2 p-2.5 sm:gap-3 sm:p-4'>
          <div className='flex-1'>
            <Link
              href={`/products/${slug}`}
              className='transition-colors hover:text-blue-600 dark:hover:text-blue-400'
            >
              <h3 className='line-clamp-2 min-h-10 text-sm font-bold leading-5 text-gray-800 dark:text-gray-100 sm:min-h-12 sm:text-base sm:leading-6'>
                {title}
              </h3>
            </Link>
            {uniqueVariants.map((c, index) => (
              <span
                key={index}
                title={c.colorName}
                aria-label={c.colorName}
                className={`inline-block size-4 rounded-full mx-0.5 border border-gray-600 shrink`}
                style={{ backgroundColor: c.color }}
              ></span>
            ))}
            <div className='mt-1 hidden items-center gap-1 text-amber-400 sm:flex'>
              <FaStar size={13} />
              <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className='flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-800'>
            <div className='flex flex-col'>
              {hasDiscount && (
                <span className='mb-0.5 text-[10px] text-gray-400 line-through dark:text-gray-500 sm:text-xs'>
                  {price?.toLocaleString('fa-IR')}
                </span>
              )}

              <div className='flex items-center gap-1'>
                <span className='text-sm font-black text-gray-900 dark:text-white sm:text-lg'>
                  {(hasDiscount ? finalPrice : price)?.toLocaleString('fa-IR')}
                </span>
                <span className='text-[10px] text-gray-500 dark:text-gray-400'>
                  تومان
                </span>
              </div>
            </div>

            <button
              type='button'
              onClick={() => handleAddToCart(product)}
              className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 active:scale-95 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5'
              aria-label='افزودن به سبد خرید'
            >
              <FaShoppingBag size={16} />
              <span className='hidden sm:inline text-sm font-medium'>
                افزودن
              </span>
            </button>
          </div>
        </div>
      </article>
    </>
  )
}
