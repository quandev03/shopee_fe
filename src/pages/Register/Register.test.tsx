import { fireEvent, screen, waitFor } from '@testing-library/react';
import { path } from 'src/constants/path';
import { logScreen, renderWithRouter } from 'src/utils/test';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

//Test render đúng trang register
//Test hiển thị đúng lỗi khi không nhập input và submit
//Test hiển thị đúng lỗi khi nhập input không đúng format
//Test hiển thị đúng lỗi email tồn tại
//Test khi đăng kí account thành công thì redirect về màn hình home

describe('Register', () => {
  let unmountAction: () => void;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let confirmPasswordInput: HTMLInputElement;
  let submitBtn: HTMLInputElement;

  beforeEach(async () => {
    const { unmount } = renderWithRouter({ route: path.register });
    expect(await screen.findByPlaceholderText('Email')).toBeTruthy();
    expect(await screen.findByPlaceholderText('Password')).toBeTruthy();
    expect(await screen.findByPlaceholderText('Confirm password')).toBeTruthy();

    emailInput = document.querySelector('form input[placeholder="Email"]') as HTMLInputElement;
    passwordInput = document.querySelector('form input[placeholder="Password"]') as HTMLInputElement;
    confirmPasswordInput = document.querySelector('form input[placeholder="Confirm password"]') as HTMLInputElement;
    submitBtn = document.querySelector('form button[type="submit"]') as HTMLInputElement;

    unmountAction = unmount;
  });

  afterEach(() => {
    unmountAction();
  });

  test('Should display required error when value is invalid', async () => {
    if (submitBtn) {
      fireEvent.submit(submitBtn);

      await waitFor(
        () => {
          expect(screen.queryByText('Vui lòng nhập email!')).toBeTruthy();
          expect(screen.queryAllByText('Vui lòng nhập password!')).toBeTruthy();
        },
        {
          timeout: 2000
        }
      );
    } else {
      throw new Error('Submit button not found');
    }
  });

  test('Should display matching error when value is invalid', async () => {
    fireEvent.input(emailInput, {
      target: {
        value: 'sang5@gmai'
      }
    });

    fireEvent.input(passwordInput, {
      target: {
        value: '123'
      }
    });

    fireEvent.input(confirmPasswordInput, {
      target: {
        value: '1234'
      }
    });

    if (submitBtn) {
      fireEvent.submit(submitBtn);

      await waitFor(
        async () => {
          expect(await screen.findAllByText('Email không hợp lệ!')).toBeTruthy();
          expect(await screen.findAllByText('Độ dài từ 6-160 ký tự')).toBeTruthy();
          expect(await screen.findAllByText('Nhập lại mật khẩu không khớp!')).toBeTruthy();
        },
        {
          timeout: 2000
        }
      );
    } else {
      throw new Error('Submit button not found');
    }
  });

  test('Should display error message when submit an existed email', async () => {
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

    fireEvent.input(confirmPasswordInput, {
      target: {
        value: '123123123'
      }
    });

    if (submitBtn) {
      fireEvent.click(submitBtn);
      await waitFor(
        () => {
          expect(screen.findByText('Email đã tồn tại')).toBeTruthy();
        },
        {
          timeout: 2000
        }
      );
    } else {
      throw new Error('Submit button not found');
    }
  })
});
