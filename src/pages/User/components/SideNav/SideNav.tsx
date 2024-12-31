import classNames from 'classnames';
import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import userSideNavDefault from 'src/assets/images/userSideNavDefault.svg';
import { path } from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { generateImageUrl } from 'src/utils/utils';

export default function SideNav() {
  const { profile } = useContext(AppContext);

  return (
    <div className='py-4 text-sm'>
      <div className='flex items-center text-sm'>
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0'>
          <img
            src={generateImageUrl(profile?.avatar) || userSideNavDefault}
            alt='avatar'
            className='h-full w-full rounded-full object-cover'
          />
        </Link>

        <div className='ml-4 flex-grow overflow-hidden'>
          <span className='truncate font-semibold text-gray-700'>{profile?.email}</span>
          <Link to={path.profile} className='mt-[1px] flex items-center gap-2 capitalize text-gray-400'>
            <svg width={12} height={12} viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              />
            </svg>
            <span className='truncate'>Sửa hồ sơ</span>
          </Link>
        </div>
      </div>

      <div className='my-4 h-[1px] w-full bg-gray-200' />

      <div className='mt-6 flex flex-col gap-4'>
        <NavLink
          to={path.profile}
          className={({ isActive }) =>
            classNames('flex items-center gap-4 capitalize', {
              'text-orange': isActive,
              'text-gray-700': !isActive
            })
          }
        >
          <div className='h-[22px] w-[22px] flex-shrink-0'>
            <img
              src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
              alt='profile'
              className='h-full w-full'
            />
          </div>
          <span>Tài khoản của tôi</span>
        </NavLink>
        <NavLink
          to={path.password}
          className={({ isActive }) =>
            classNames('flex items-center gap-4 capitalize', {
              'text-orange': isActive,
              'text-gray-700': !isActive
            })
          }
        >
          <div className='h-[22px] w-[22px] flex-shrink-0'>
            <img
              src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
              alt='profile'
              className='h-full w-full'
            />
          </div>
          <span>Đổi mật khẩu</span>
        </NavLink>
        <NavLink
          to={path.purchaseHistory}
          className={({ isActive }) =>
            classNames('flex items-center gap-4 capitalize', {
              'text-orange': isActive,
              'text-gray-700': !isActive
            })
          }
        >
          <div className='h-[22px] w-[22px] flex-shrink-0'>
            <img
              src='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
              alt='profile'
              className='h-full w-full'
            />
          </div>
          <span>Đơn mua</span>
        </NavLink>
      </div>
    </div>
  );
}
