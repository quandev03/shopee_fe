import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useContext, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import AppProvider, { AppContext } from './contexts/app.context';
import useRouteElement from './hooks/useRouteElement';
import { localStorageEventTarget } from './utils/auth';

function App() {
  const routeElement = useRouteElement();
  const { clearData } = useContext(AppContext);

  useEffect(() => {
    localStorageEventTarget.addEventListener('clearData', () => {
      clearData();
    });

    return () => {
      localStorageEventTarget.removeEventListener('clearData', clearData);
    };
  }, [clearData]);

  return (
    <HelmetProvider>
      <ErrorBoundary>{routeElement}</ErrorBoundary>
      <ToastContainer autoClose={1500} closeOnClick />
      <ReactQueryDevtools initialIsOpen={false} />
    </HelmetProvider>
  );
}

export default App;
