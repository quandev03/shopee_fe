import React, { Component, ErrorInfo } from 'react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <section className='bg-white dark:bg-gray-900'>
          <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
            <div className='mx-auto max-w-screen-sm text-center'>
              <h1 className='dark:text-primary-500 mb-4 text-5xl font-extrabold tracking-tight text-orange lg:text-7xl'>
                500
              </h1>
              <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>Something went wrong</p>
              <a
                href='/'
                className='focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg bg-orange px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-orange/80 focus:outline-none focus:ring-4'
              >
                Back to Homepage
              </a>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
