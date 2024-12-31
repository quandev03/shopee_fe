import { createSearchParams, useNavigate } from 'react-router-dom';
import NonStarFilled from 'src/components/Star/NonStarFilled';
import StarFilled from 'src/components/Star/StarFilled';
import { path } from 'src/constants/path';
import { QueryConfig } from 'src/hooks/useQueryConfig';
import { useTranslation } from 'react-i18next';

interface Props {
  queryConfig: QueryConfig;
}

export default function RatingStar({ queryConfig }: Props) {
  const { t } = useTranslation('home');

  const navigate = useNavigate();

  const handleRatingFilter = (ratingFilter: number) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        page: '1',
        rating_filter: ratingFilter.toString()
      }).toString()
    });
  };

  return (
    <ul>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <li className='mt-4 flex cursor-pointer items-center gap-2' key={index}>
            <div
              aria-hidden='true'
              role='button'
              tabIndex={0}
              className='flex items-center gap-1'
              onClick={() => handleRatingFilter(5 - index)}
            >
              {Array(5)
                .fill(0)
                .map((_, indexStar) => {
                  if (5 - indexStar > index) {
                    return <StarFilled key={indexStar} />;
                  }
                  return <NonStarFilled key={indexStar} />;
                })}

              {index !== 0 && <span>{t('& up')}</span>}
            </div>
          </li>
        ))}
    </ul>
  );
}
