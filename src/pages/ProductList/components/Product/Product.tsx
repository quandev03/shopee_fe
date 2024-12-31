import { Link } from 'react-router-dom';
import ProductRating from 'src/components/ProductRating';
import { path } from 'src/constants/path';
import { Product as ProductType } from 'src/@types/product.type';
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils';
import { useTranslation } from 'react-i18next';

interface Props {
  product: ProductType;
}

export default function Product({ product }: Props) {
  const { t } = useTranslation('product');
  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='overflow-hidden rounded-sm bg-white text-xs shadow transition-transform duration-100 hover:translate-y-[-0.1rem] hover:shadow-sm'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
          />
        </div>

        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem]'>{product.name}</div>

          <div className='mt-3'>
            <div className='flex items-center gap-2'>
              <div className='max-w-[50%] truncate text-gray-500 line-through'>
                <span>₫</span>
                <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
              </div>

              <div className='text-orange'>
                <span>₫</span>
                <span className='text-sm'>{formatCurrency(product.price)}</span>
              </div>
            </div>
          </div>

          <div className='mt-3'>
            <div className='flex items-center gap-2'>
              <ProductRating rating={product.rating} />

              <div>
                {t('sold')} <span>{formatNumberToSocialStyle(product.sold)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
