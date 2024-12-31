import classNames from 'classnames';
import omit from 'lodash/omit';
import { Controller, useForm } from 'react-hook-form';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import Button from 'src/components/Button';
import { path } from 'src/constants/path';
import { Category } from 'src/@types/category.type';
import { Schema, schema } from 'src/utils/rules';
import RatingStar from './RatingStar';

import { yupResolver } from '@hookform/resolvers/yup';
import InputNumber from 'src/components/Form/InputNumber';
import { NoUndefinedField } from 'src/@types/utils.type';
import { QueryConfig } from 'src/hooks/useQueryConfig';
import InputV2 from 'src/components/Form/InputV2';
import { useTranslation } from 'react-i18next';

interface Props {
  queryConfig: QueryConfig;
  categories: Category[];
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>;

const priceSchema = schema.pick(['price_min', 'price_max']);

export default function AsideFilter({ categories, queryConfig }: Props) {
  const { category } = queryConfig;
  const { t } = useTranslation(['home', 'common']);

  const navigate = useNavigate();

  const { handleSubmit, formState, control, trigger } = useForm<FormData>({
    defaultValues: {
      price_max: '',
      price_min: ''
    },
    resolver: yupResolver(priceSchema)
  });

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            page: '1'
          },
          ['rating_filter', 'category', 'price_min', 'price_max']
        )
      ).toString()
    });
  };

  const onSubmitPrice = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        page: '1',
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    });
  });

  return (
    <div>
      <Link
        to={path.home}
        className={classNames('flex items-center gap-2 font-semibold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='h-3 w-4 shrink-0 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>

        <span className='flex-grow capitalize'>{t('category.all categories')}</span>
      </Link>

      <div className='my-4 h-[1px] bg-gray-200' />

      <div className='mb-10 text-sm'>
        <ul className='font-sm'>
          {categories.map((categoryItem) => {
            const isActive = categoryItem._id === category;

            return (
              <li key={categoryItem._id} className='ml-3 mt-4'>
                <Link
                  to={{
                    pathname: path.home,
                    search: createSearchParams({
                      ...queryConfig,
                      page: '1',
                      category: categoryItem._id
                    }).toString()
                  }}
                  className={classNames('relative  capitalize', {
                    'font-semibold text-orange': isActive
                  })}
                >
                  {isActive && (
                    <svg viewBox='0 0 4 7' className='absolute -left-3 top-1 h-2 w-2 fill-current'>
                      <polygon points='4 3.5 0 0 0 7'></polygon>
                    </svg>
                  )}
                  {categoryItem.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div className='flex items-center gap-2 font-semibold'>
          <svg
            enableBackground='new 0 0 15 15'
            viewBox='0 0 15 15'
            x='0'
            y='0'
            className='h-3 w-4 flex-shrink stroke-current'
          >
            <g>
              <polyline
                fill='none'
                points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit='10'
              ></polyline>
            </g>
          </svg>

          <span className='uppercase'>{t('search filter')}</span>
        </div>
      </div>

      <div className='my-4 h-[1px] bg-gray-200' />

      <div className='text-sm'>
        <span className='mb-6 capitalize'>{t('price range')}</span>
        <form onSubmit={onSubmitPrice}>
          <div className='mt-4 flex items-center gap-3'>
            <InputV2
              control={control}
              name='price_min'
              placeholder={`₫ ${t('min')}`}
              type='number'
              className='flex items-center'
              classNameInput='w-full rounded-sm border border-gray-300 shadow-sm outline-none px-2 py-1'
              classNameError='hidden'
              onChange={() => {
                trigger('price_max');
              }}
            />

            {/* <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    placeholder='₫ TỪ'
                    className='flex items-center'
                    classNameInput='w-full rounded-sm border border-gray-300 shadow-sm outline-none px-2 py-1'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      trigger('price_max');
                    }}
                  />
                );
              }}
            /> */}
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    placeholder={`₫ ${t('max')}`}
                    className='flex items-center'
                    classNameInput='w-full rounded-sm border border-gray-300 shadow-sm outline-none px-2 py-1'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      trigger('price_min');
                    }}
                  />
                );
              }}
            />
          </div>

          <div className='my-1 min-h-[1.25rem] text-center text-red-500'>{formState.errors.price_min?.message}</div>

          <Button
            className='w-full rounded-sm border-none bg-orange px-3 py-2 uppercase text-white shadow-sm focus:bg-orange/80'
            type='submit'
          >
            {t('apply', { ns: 'common' })}
          </Button>
        </form>
      </div>

      <div className='my-4 h-[1px] bg-gray-200' />

      <div className='text-sm'>
        <span className='capitalize'>{t('rating')}</span>

        <RatingStar queryConfig={queryConfig} />
      </div>

      <div className='my-4 h-[1px] bg-gray-200' />

      <Button
        className='w-full rounded-sm border-none bg-orange px-3 py-2 text-sm uppercase text-white shadow-sm focus:bg-orange/80'
        onClick={handleRemoveAll}
      >
        {t('delete all', { ns: 'common' })}
      </Button>
    </div>
  );
}
