import { delay, logScreen, renderWithRouter } from 'src/utils/test';
import { describe, expect, test } from 'vitest';

describe('ProductDetail', () => {
  test('Test product detail page', async () => {
    renderWithRouter({ route: '/Điện-thoại-Apple-Iphone-12-64GB--Hàng-chính-hãng-VNA-i-60afb1c56ef5b902180aacb8' });

    await delay(2000);

    expect(document.body).toMatchSnapshot();
  });
});
