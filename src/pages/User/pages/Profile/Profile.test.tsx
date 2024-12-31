import { waitFor } from '@testing-library/react';
import { path } from 'src/constants/path';
import { accessToken } from 'src/msw/auth.msw';
import { setAccessTokenToLS } from 'src/utils/auth';
import { logScreen, renderWithRouter } from 'src/utils/test';
import { describe, expect, test } from 'vitest';

describe('Test Profile page', () => {
  test('Display Profile page', async () => {
    setAccessTokenToLS(accessToken);
    const { container } = renderWithRouter({ route: path.profile });

    await waitFor(
      () => {
        expect((container.querySelector('form input[placeholder="Tên"]') as HTMLInputElement).value).toBe(
          'Hồ Hoàng Sang'
        );
      },
      {
        timeout: 5000
      }
    );
  });
});
