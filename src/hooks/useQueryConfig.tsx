import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { ProductListConfig } from 'src/@types/product.type';
import { useQueryParams } from './useQueryParams';

export type QueryConfig = {
  [key in keyof ProductListConfig]: string;
};

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      category: queryParams.category,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      sort_by: queryParams.sort_by
    },
    isUndefined
  );

  return queryConfig;
}
