import React, { Fragment } from 'react';
import CartHeader from 'src/components/CartHeader';
import Footer from 'src/components/Footer';

interface Props {
  children: React.ReactNode;
}

export default function CartLayout({ children }: Props) {
  return (
    <Fragment>
      <CartHeader />
      {children}
      <Footer />
    </Fragment>
  );
}
