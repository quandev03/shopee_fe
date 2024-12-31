import { yupResolver } from '@hookform/resolvers/yup';
import omit from 'lodash/omit';
import { useForm } from 'react-hook-form';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { path } from 'src/constants/path';
import { Schema, schema } from 'src/utils/rules';
import useQueryConfig from './useQueryConfig';

type FormData = Pick<Schema, 'searchName'>;
const searchSchema = schema.pick(['searchName']);

export default function useSearchProduct() {
  const navigate = useNavigate();
  const queryConfig = useQueryConfig();
  const { handleSubmit, register } = useForm<FormData>({
    values: {
      searchName: queryConfig.name || ''
    },
    resolver: yupResolver(searchSchema)
  });

  const handleSearchName = handleSubmit((data) => {
    const { searchName } = data;

    const query = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            page: '1',
            name: searchName
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          page: '1',
          name: searchName
        };

    navigate({
      pathname: path.home,
      search: createSearchParams(query).toString()
    });
  });

  return { handleSearchName, register };
}
