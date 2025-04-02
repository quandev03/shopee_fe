import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { BackTop } from 'antd';
import { UpOutlined } from '@ant-design/icons';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Nội dung trang sẽ được render thông qua Outlet */}
        <Outlet />
      </main>
      
      <Footer />
      
      <BackTop>
        <div className="flex items-center justify-center bg-orange-500 text-white h-10 w-10 rounded-full shadow-lg">
          <UpOutlined />
        </div>
      </BackTop>
    </div>
  );
};

export default MainLayout; 