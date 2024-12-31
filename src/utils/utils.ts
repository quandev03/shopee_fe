import axios, { AxiosError, HttpStatusCode } from 'axios';
import { ResponseErrorType } from 'src/@types/utils.type';
import config from 'src/constants/config';

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error);
}

export function isAxiosErrorUnprocessableEntity<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

export function isAxiosErrorUnauthorized<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized;
}

export function isExpiredTokenError<ExpriredError>(error: unknown): error is AxiosError<ExpriredError> {
  return (
    isAxiosErrorUnauthorized<ResponseErrorType<{ message: string; name: string }>>(error) &&
    error.response?.data.data?.name === 'EXPIRED_TOKEN'
  );
}

export const formatCurrency = (currency: number) => {
  return new Intl.NumberFormat('de-DE').format(currency);
};

export const formatNumberToSocialStyle = (value: number) => {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase();
};

export const saleRate = (oldPrice: number, salePrice: number) => {
  const rating = Math.round(((oldPrice - salePrice) * 100) / oldPrice);

  return rating + '%';
};

const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '');

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replaceAll(/\s/g, '-') + `-i-${id}`;
};

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-');
  return arr[arr.length - 1];
};

export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateImageUrl(avatarName?: string) {
  return avatarName ? `${config.baseUrl}/images/${avatarName}` : '';
}
