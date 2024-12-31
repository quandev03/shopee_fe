import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from 'src/api/auth.api';
import userHeaderDefault from 'src/assets/images/userHeaderDefault.svg';
import { path } from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';
import { generateImageUrl } from 'src/utils/utils';
import Popover from '../Popover';
import { useTranslation } from 'react-i18next';
import { locales } from 'src/i18n/i18n';
import classNames from 'classnames';

type KeyLang = keyof typeof locales;

export default function NavHeader() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext);

  const { i18n } = useTranslation();

  const language = locales[i18n.language as KeyLang];

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logoutAccount(),
    onSuccess: () => {
      setIsAuthenticated(false);
      setProfile(null);
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const changeLanguage = (lng: KeyLang) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className='flex justify-end'>
      <Popover
        renderPopover={
          <div className='flex flex-col gap-4 py-2 pl-3 pr-28'>
            <button
              onClick={() => changeLanguage('vi')}
              className={classNames('text-left text-black hover:text-orange', {
                'text-orange': i18n.language === 'vi'
              })}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={classNames('text-left text-black hover:text-orange', {
                'text-orange': i18n.language === 'en'
              })}
            >
              English
            </button>
          </div>
        }
        className='flex cursor-pointer items-center text-sm text-white hover:text-gray-300'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>

        <span className='mx-1 capitalize'>{language}</span>

        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>

      {isAuthenticated && (
        <Popover
          renderPopover={
            <div className='flex flex-col gap-x-4 gap-y-6 py-2 pl-3 pr-20'>
              <Link to={path.profile} className='text-left hover:text-[#00bfa5] '>
                Tài khoản của tôi
              </Link>
              <Link to={path.purchaseHistory} className='text-left hover:text-[#00bfa5] '>
                Đơn mua
              </Link>
              <button onClick={handleLogout} className='text-left hover:text-[#00bfa5] '>
                Đăng xuất
              </button>
            </div>
          }
          className='ml-4 flex cursor-pointer items-center text-sm text-white hover:text-gray-300'
        >
          <div className='h-6 w-6'>
            <img
              src={generateImageUrl(profile?.avatar) || userHeaderDefault}
              alt='avatar'
              className='h-full w-full flex-shrink rounded-full object-cover'
            />
          </div>

          <span className='mx-1'>{profile?.email}</span>
        </Popover>
      )}

      {!isAuthenticated && (
        <div className='ml-4 flex items-center text-sm text-white'>
          <Link to={path.register} className='capitalize hover:text-gray-300'>
            Đăng ký
          </Link>
          <span className='mx-2 font-thin text-gray-200'>|</span>
          <Link to={path.login} className='capitalize hover:text-gray-300'>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
}
