import PriceInfoCard from '@/components/PriceInfoCard'
import { getProductById } from '@/lib/actions'
import { formatNumber } from '@/lib/utils'
import { Product } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type Props = {
  params: { id: string }
}
const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id)

  if (!product) redirect('/')

  const {
    image,
    title,
    url,
    reviewsCount,
    stars,
    currency,
    currentPrice,
    originalPrice,
    averagePrice,
    highestPrice,
    lowestPrice,
  } = product
  return (
    <div className='product-caontainer'>
      <div className='flex gap-28 xl:flex-row flex-col'>
        <div className='product-image'>
          <Image
            src={image}
            alt={title}
            width={580}
            height={400}
            className='mx-auto'
          />
        </div>

        <div className='flex-1 flex flex-col'>
          <div className='flex justify-between items-start gap-5 flex-wrap pb-6'>
            <div className='flex flex-col gap-3'>
              <p className='text-[28px] text-secondary font-semibold'>
                {title}
              </p>

              <Link
                href={url}
                target='_blank'
                className='text-base text-black opacity-50'
              >
                Visit Product
              </Link>
            </div>

            <div className='flex items-center gap-3'>
              <div className='product-hearts'>
                <Image
                  src='/assets/icons/red-heart.svg'
                  alt='heart'
                  width={20}
                  height={20}
                />

                <p className='text-base font-semibold text-[#d46f77]'>
                  {reviewsCount}
                </p>
              </div>

              <div className='p-2 bg-white-200 rounded-10'>
                <Image
                  src='/assets/icons/bookmark.svg'
                  alt='bookmark'
                  width={20}
                  height={20}
                />
              </div>

              <div className='p-2 bg-white-200 rounded-10'>
                <Image
                  src='/assets/icons/share.svg'
                  alt='share'
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>

          <div className='product-info'>
            <div className='flex flex-col gap-2'>
              <p className='text-[34px] text-secondary font-bold'>
                {formatNumber(currentPrice)} {currency}
              </p>
              <p className='text-[21px] text-black opacity-50 line-through'>
                {formatNumber(originalPrice)} {currency}
              </p>
            </div>

            <div className='flex flex-col gap-4'>
              <div className='flex gap-3'>
                <div className='product-stars'>
                  {Array.from({ length: stars }).map((_, idx) => (
                    <Image
                      key={idx}
                      src='/assets/icons/star.svg'
                      alt='star'
                      width={16}
                      height={16}
                    />
                  ))}
                </div>

                <div className='product-reviews'>
                  <Image
                    src='/assets/icons/comment.svg'
                    alt='commentr'
                    width={16}
                    height={16}
                  />
                  <p className='text-sm tet-secondary font-semibold'>
                    {reviewsCount} Reviews
                  </p>
                </div>
              </div>

              <p className='text-sm text-black opacity-50'>
                <span className='text-primary-green font-semibold'>93% </span>{' '}
                of buyers have recommended this.
              </p>
            </div>
          </div>

          <div className='my-7 flex flex-col gap-5'>
            <div className='flex gap-5 flex-wrap'>
              <PriceInfoCard
                title='Current Price'
                iconSrc='/assets/icons/price-tag.svg'
                value={`${formatNumber(currentPrice)} ${currency}`}
              />
              <PriceInfoCard
                title='Average Price'
                iconSrc='/assets/icons/chart.svg'
                value={`${formatNumber(averagePrice)} ${currency}`}
              />
              <PriceInfoCard
                title='Highest Price'
                iconSrc='/assets/icons/arrow-up.svg'
                value={`${formatNumber(highestPrice)} ${currency}`}
              />
              <PriceInfoCard
                title='Lowest Price'
                iconSrc='/assets/icons/arrow-down.svg'
                value={`${formatNumber(lowestPrice)} ${currency}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
