import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <section className='bg-white dark:bg-gray-900'>
      <Helmet>
        <title>Not found</title>
        <meta name='not found' content='Page not found' />
      </Helmet>
      <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
        <div className='mx-auto max-w-screen-sm text-center'>
          <h1 className='dark:text-primary-500 mb-4 text-5xl font-extrabold tracking-tight text-orange lg:text-7xl'>
            404
          </h1>
          <p className='mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl'>
            Something is missing.
          </p>
          <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
            Sorry, we can not find that page. You will find lots to explore on the home page.{' '}
          </p>
          <Link
            to='/'
            className='focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg bg-orange px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-orange/80 focus:outline-none focus:ring-4'
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
