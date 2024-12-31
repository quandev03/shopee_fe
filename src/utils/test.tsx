import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, type waitForOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TestScreenProps } from 'src/@types/test.type';
import App from 'src/App';
import AppProvider, { getInitContext } from 'src/contexts/app.context';
import { expect, test } from 'vitest';

export const delay = (time: number) =>
  new Promise((resolve) => {
    return setTimeout(() => {
      resolve(true);
    }, time);
  });

export const logScreen = async (
  node: HTMLElement = document.body.parentElement as HTMLElement,
  options?: waitForOptions
) => {
  const { timeout = 3000 } = options || {};
  await waitFor(
    async () => {
      expect(await delay(timeout - 200)).toBe(true);
    },
    {
      ...options,
      timeout
    }
  );

  screen.debug(node, 9999999);
};

export const createProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      },
      mutations: {
        retry: false
      }
    },
    logger: {
      // No more errors on the console
      error: () => null,
      warn: console.warn,
      log: console.log
    }
  });

  const Provider = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  return Provider;
};

const Provider = createProvider();

export const renderWithRouter = ({ route = '/' }) => {
  window.history.pushState({}, 'Test page', route);

  const initialContext = getInitContext();
  return {
    userEvent,
    ...render(
      <Provider>
        <AppProvider defaultContext={initialContext}>
          <App />
        </AppProvider>
      </Provider>,
      {
        wrapper: BrowserRouter
      }
    )
  };
};

export const testScreen = (object: TestScreenProps) => {
  const { title, testFn, document } = object;
  const { ui = <App />, wrapper = Fragment } = document;

  return test(title, async () => {
    const { unmount } = render(ui, {
      wrapper
    });

    await testFn();

    unmount();
  });
};
