import classNames from 'classnames';
import omit from 'lodash/omit';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { path } from 'src/constants/path';
import { order as orderConstant, sortBy } from 'src/constants/product';
import { QueryConfig } from 'src/hooks/useQueryConfig';
import { ProductListConfig } from 'src/@types/product.type';
import { useTranslation } from 'react-i18next';

interface Props {
  pageSize: number;
  queryConfig: QueryConfig;
}

export default function SortProduct({ pageSize, queryConfig }: Props) {
  const { t } = useTranslation('home');
  const page = Number(queryConfig.page);
  const navigate = useNavigate();

  const { sort_by = sortBy.createdAt, order } = queryConfig;

  const isActiveSort = (sortValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortValue;
  };

  const handleSort = (sortValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortValue,
            page: '1'
          },
          ['order']
        )
      ).toString()
    });
  };

  const handleOrderPrice = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        page: '1',
        sort_by: 'price',
        order: orderValue
      }).toString()
    });
  };

  return (
    <div className='flex flex-wrap items-center justify-between gap-4 bg-gray-200 px-6 py-3 text-sm'>
      <div className='grid grid-cols-6 items-center gap-3'>
        <span className='col-span-1 text-black/70'>{t('sort by')}</span>
        <button
          className={classNames('col-span-1 rounded-sm px-3 py-2 capitalize shadow-sm outline-none', {
            'bg-orange text-white hover:bg-orange/70': isActiveSort(sortBy.view),
            'bg-white hover:bg-slate-100': !isActiveSort(sortBy.view)
          })}
          onClick={() => handleSort(sortBy.view)}
        >
          {t('popular')}
        </button>
        <button
          className={classNames('col-span-1 rounded-sm px-3 py-2 capitalize shadow-sm outline-none', {
            'bg-orange text-white hover:bg-orange/70': isActiveSort(sortBy.createdAt),
            'bg-white hover:bg-slate-100': !isActiveSort(sortBy.createdAt)
          })}
          onClick={() => handleSort(sortBy.createdAt)}
        >
          {t('latest')}
        </button>
        <button
          className={classNames('col-span-1 rounded-sm px-3 py-2 capitalize shadow-sm outline-none', {
            'bg-orange text-white hover:bg-orange/70': isActiveSort(sortBy.sold),
            'bg-white hover:bg-slate-100': !isActiveSort(sortBy.sold)
          })}
          onClick={() => handleSort(sortBy.sold)}
        >
          {t('top sales')}
        </button>

        <select
          value={order || ''}
          className={classNames('col-span-2 h-9 rounded-sm border-none px-2 outline-none', {
            'bg-orange text-white hover:bg-orange/70': isActiveSort(sortBy.price),
            'bg-white': !isActiveSort(sortBy.price)
          })}
          onChange={(event) => handleOrderPrice(event.target.value as Exclude<ProductListConfig['order'], undefined>)}
        >
          <option value='' disabled className='bg-white text-black'>
            {t('price')}
          </option>

          <option value={orderConstant.asc} className='bg-white text-black'>
            {t('low to high')}
          </option>
          <option value={orderConstant.desc} className='bg-white text-black'>
            {t('high to low')}
          </option>
        </select>
      </div>

      <div className='flex items-center gap-4'>
        <div>
          <span className='text-orange'>{page}</span>
          <span>/{pageSize}</span>
        </div>
        <div className='flex items-center justify-center'>
          {page == 1 ? (
            <span className='flex cursor-not-allowed items-center rounded-sm border border-gray-300 bg-slate-100 p-2 outline-none'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </span>
          ) : (
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: (page - 1).toString()
                }).toString()
              }}
              className='flex items-center rounded-sm border border-gray-300 bg-white p-2 outline-none'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </Link>
          )}

          {page == pageSize ? (
            <span className='flex cursor-not-allowed items-center rounded-sm border border-gray-300 bg-slate-100 p-2 outline-none'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </span>
          ) : (
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: (page + 1).toString()
                }).toString()
              }}
              className='flex items-center rounded-sm border border-gray-300 bg-white p-2 outline-none'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
