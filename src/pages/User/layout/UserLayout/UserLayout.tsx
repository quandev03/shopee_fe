import { Outlet } from 'react-router-dom';
import SideNav from '../../components/SideNav';

export default function UserLayout() {
  return (
    <div className='bg-neutral-100 py-4'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-12 md:col-span-3 lg:col-span-2'>
            <SideNav />
          </div>

          <div className='col-span-12 md:col-span-9 lg:col-span-10'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
