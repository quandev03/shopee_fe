import { describe, expect, test } from 'vitest';
import { isAxiosError, isAxiosErrorUnprocessableEntity, isExpiredTokenError } from '../utils';
import { AxiosError, HttpStatusCode } from 'axios';

// Describe dùng để mô tả tập hơp các ngữ cảnh
// Hoặc 1 đơn vị cần test: Ví dụ function, component
describe('isAxiosError', () => {
  //test ghi chú trường hợp cần test
  test('isAxiosError will return a boolean value', () => {
    expect(isAxiosError(new Error())).toBe(false);
    expect(isAxiosError(new AxiosError())).toBe(true);
  });
});

describe('isAxiosErrorUnprocessableEntity', () => {
  test('The error must be an Axios Error', () => {
    expect(isAxiosErrorUnprocessableEntity(new Error())).toBe(false);
  });

  test('isAxiosErrorUnprocessableEntity will return a boolean value', () => {
    expect(
      isAxiosErrorUnprocessableEntity(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError
        } as any)
      )
    ).toBe(false);
    expect(
      isAxiosErrorUnprocessableEntity(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity
        } as any)
      )
    ).toBe(true);
  });
});

describe('isExpiredTokenError', () => {
  test('The error must be an Axios Error', () => {
    expect(isExpiredTokenError(new Error())).toBe(false);

    expect(isExpiredTokenError(1)).toBe(false);

    expect(isExpiredTokenError('v123123')).toBe(false);

    expect(isExpiredTokenError(undefined)).toBe(false);

    expect(isExpiredTokenError(null)).toBe(false);
  });

  test('The error must be kind of Unauthoried', () => {
    expect(
      isExpiredTokenError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError
        } as any)
      )
    ).toBe(false);

    expect(
      isExpiredTokenError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity
        } as any)
      )
    ).toBe(false);
  });

  test('The error must be kind of Unauthoried and expired token error', () => {
    expect(
      isExpiredTokenError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          data: {
            data: {
              name: 'EXPIRED_TOKEN'
            }
          }
        } as any)
      )
    ).toBe(false);

    expect(
      isExpiredTokenError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          data: {
            data: {
              name: 'INVALID_TOKEN'
            }
          }
        } as any)
      )
    ).toBe(false);

    expect(
      isExpiredTokenError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.Unauthorized,
          data: {
            data: {
              name: 'EXPIRED_TOKEN'
            }
          }
        } as any)
      )
    ).toBe(true);
  });
});
