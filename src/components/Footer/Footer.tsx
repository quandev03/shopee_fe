import { useTranslation } from 'react-i18next';
export default function Footer() {
  const { t } = useTranslation('footer');

  return (
    <footer className='bg-neutral-100 py-16'>
      <div className='container text-neutral-500'>
        <div className='grid grid-cols-1 gap-4 text-sm lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            <div>{t('lisence.lisence 2023')}</div>
          </div>
          <div className='lg:col-span-2'>
            <div>
              Quốc gia & Khu vực: Singapore | Indonesia | Đài Loan | Thái Lan | Malaysia | Việt Nam | Philippines |
              Brazil | México | Colombia | Chile
            </div>
          </div>
        </div>

        <div className='mt-10 text-center text-xs'>
          <div>{t('shopee company')}</div>
          <div className='mt-6'>{t('address')}</div>
          <div className='mt-2'>{t('content management')}</div>
          <div className='mt-2'>{t('business certificate')}</div>
          <div className='mt-2'>{t('lisence.lisence 2015')}</div>
        </div>
      </div>
    </footer>
  );
}
