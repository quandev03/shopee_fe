import classNames from 'classnames';
import { Link, createSearchParams } from 'react-router-dom';
import { path } from 'src/constants/path';
import { QueryConfig } from 'src/hooks/useQueryConfig';

interface Props {
  pageSize: number;
  queryConfig: QueryConfig;
}

const RANGE = 2;

export default function Pagination({ pageSize, queryConfig }: Props) {
  const page = Number(queryConfig.page);

  const renderPagination = () => {
    let dotsAfter = false;
    let dotsBefore = false;
    const renderDotsAfter = (index: number) => {
      if (!dotsAfter) {
        dotsAfter = true;

        return (
          <span key={index} className='flex items-center bg-transparent px-3 py-2 outline-none'>
            ...
          </span>
        );
      }
      return null;
    };

    const renderDotsBefore = (index: number) => {
      if (!dotsBefore) {
        dotsBefore = true;
        return (
          <span key={index} className='flex items-center bg-transparent px-3 py-2 outline-none'>
            ...
          </span>
        );
      }
      return null;
    };

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNum = index + 1;

        if (page <= RANGE * 2 + 1 && pageNum > page + RANGE && pageNum <= pageSize - RANGE) {
          return renderDotsAfter(index);
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNum > RANGE && pageNum < page - RANGE) {
            return renderDotsBefore(index);
          } else if (pageNum > page + RANGE && pageNum <= pageSize - RANGE) {
            return renderDotsAfter(index);
          }
        } else if (page >= pageSize - RANGE * 2 && pageNum > RANGE && pageNum < page - RANGE) {
          return renderDotsBefore(index);
        }

        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNum.toString()
              }).toString()
            }}
            key={index}
            className={classNames('flex items-center rounded-lg px-4 py-1 text-lg outline-none', {
              'bg-orange text-white': page === pageNum,
              'bg-transparentsparent text-slate-600': page !== pageNum
            })}
          >
            {pageNum}
          </Link>
        );
      });
  };

  return (
    <div className='mt-6 flex flex-wrap items-center justify-center gap-4'>
      {page == 1 ? (
        <span className='flex cursor-not-allowed items-center rounded-sm px-3 py-2 outline-none'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5 text-slate-600'
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
          className='flex items-center rounded-sm px-3 py-2 outline-none'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5 text-slate-600'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </Link>
      )}
      {renderPagination()}
      {page == pageSize ? (
        <span className='flex cursor-not-allowed items-center rounded-sm px-3 py-2 outline-none'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5 text-slate-600'
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
          className='flex items-center rounded-sm px-3 py-2 outline-none'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5 text-slate-600'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </Link>
      )}
    </div>
  );
}
