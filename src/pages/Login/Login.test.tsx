import '@testing-library/jest-dom/vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { path } from 'src/constants/path';
import { logScreen, renderWithRouter } from 'src/utils/test';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('Login page', async () => {
  let unmoutAction: any;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let submitBtn: HTMLInputElement;

  beforeEach(async () => {
    const { unmount } = renderWithRouter({ route: path.login });
    expect(await screen.findByPlaceholderText('Email')).toBeInTheDocument();
    expect(await screen.findByPlaceholderText('Password')).toBeInTheDocument();

    emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement;
    passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement;
    submitBtn = document.querySelector('form button[type="submit"]') as HTMLInputElement;

    unmoutAction = unmount;
  });

  afterEach(() => {
    unmoutAction && unmoutAction();
  });

  test('Display required error when value is invalid', async () => {
    if (submitBtn) {
      fireEvent.click(submitBtn);
      await waitFor(
        () => {
          expect(screen.queryByText(/Vui lòng nhập email!/i)).toBeTruthy();
          expect(screen.queryByText(/Vui lòng nhập password!/i)).toBeTruthy();
        },
        {
          timeout: 2000
        }
      );
    } else {
      throw new Error('Submit button not found!');
    }

    // await logScreen();
  });

  test('Should display matching error when email or password is invalid', async () => {
    fireEvent.input(emailInput, {
      target: {
        value: '123'
      }
    });

    fireEvent.input(passwordInput, {
      target: {
        value: '123'
      }
    });

    if (submitBtn) {
      fireEvent.click(submitBtn);

      await waitFor(
        () => {
          expect(screen.queryByText(/Email không hợp lệ!/i)).toBeTruthy();
          expect(screen.queryByText(/Độ dài từ 6-160 ký tự/i)).toBeTruthy();
        },
        {
          timeout: 5000
        }
      );
    } else {
      throw new Error('Submit button not found!');
    }
  });

  test('Should not display error when typing email and password matching', async () => {
    fireEvent.input(emailInput, {
      target: {
        value: 'sang5@gmail.com'
      }
    });

    fireEvent.input(passwordInput, {
      target: {
        value: '123123123'
      }
    });

    //Những trường hợp chứng minh rằng tìm không thấy text
    //Thì nên dùng query hơn là dùng find hay get
    //Bỡi vì find là 1 promise, khi promise bị lỗi thì sẽ throw ra lỗi

    await waitFor(
      () => {
        expect(screen.queryByText(/Email không hợp lệ!/i)).toBeFalsy();
        expect(screen.queryByText(/Độ dài từ 6-160 ký tự/i)).toBeFalsy();
      },
      {
        timeout: 2000
      }
    );

    fireEvent.click(submitBtn);

    // await logScreen();

    await waitFor(
      () => {
        expect(document.querySelector('title')?.textContent).toBe('Shopee Clone | Ho Hoang Sang');
      },
      {
        timeout: 2000
      }
    );
  });
});
