import { Suspense, lazy, useContext } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { path } from 'src/constants/path';
import { AppContext } from 'src/contexts/app.context';

const AuthLayout = lazy(() => import('src/layouts/AuthLayout'));
const CartLayout = lazy(() => import('src/layouts/CartLayout'));
const MainLayout = lazy(() => import('src/layouts/MainLayout'));
const Cart = lazy(() => import('src/pages/Cart'));
const Login = lazy(() => import('src/pages/Login'));
const NotFound = lazy(() => import('src/pages/NotFound'));
const ProductDetail = lazy(() => import('src/pages/ProductDetail'));
const ProductList = lazy(() => import('src/pages/ProductList'));
const Register = lazy(() => import('src/pages/Register'));
const UserLayout = lazy(() => import('src/pages/User/layout/UserLayout'));
const ChangePassword = lazy(() => import('src/pages/User/pages/ChangePassword'));
const Profile = lazy(() => import('src/pages/User/pages/Profile'));
const PurchaseHistory = lazy(() => import('src/pages/User/pages/PurchaseHistory'));

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />; //chưa dăng nhập thì đá ra màn hình login, đã đăng nhập thì tiếp tục render route con
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />; //đã dăng nhập thì đá ra màn hình chính, chưa đăng nhập thì tiếp tục render route con
}

export default function useRouteElement() {
  const elementRoute = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.user,
          element: (
            <Suspense>
              <MainLayout>
                <UserLayout />
              </MainLayout>
            </Suspense>
          ),
          children: [
            {
              path: path.profile,
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: path.password,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              )
            },
            {
              path: path.purchaseHistory,
              element: (
                <Suspense>
                  <PurchaseHistory />
                </Suspense>
              )
            }
          ]
        },

        {
          path: path.cart,
          element: (
            <Suspense>
              <CartLayout>
                <Cart />
              </CartLayout>
            </Suspense>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <Suspense>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </Suspense>
          )
        },
        {
          path: path.register,
          element: (
            <Suspense>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </Suspense>
          )
        }
      ]
    },
    {
      path: path.home,
      index: true, //Phân biệt đây là route chính để không bị trùng lặp với các kiểu path là ''
      element: (
        <Suspense>
          <MainLayout>
            <ProductList />
          </MainLayout>
        </Suspense>
      )
    },
    {
      path: path.productDetail,
      element: (
        <Suspense>
          <MainLayout>
            <ProductDetail />
          </MainLayout>
        </Suspense>
      )
    },
    {
      path: '*',
      element: (
        <Suspense>
          <MainLayout>
            <NotFound />
          </MainLayout>
        </Suspense>
      )
    }
  ]);

  return elementRoute;
}
