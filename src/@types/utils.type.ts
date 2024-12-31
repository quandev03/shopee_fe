export interface ResponseSuccessType<Data> {
  message: string;
  data: Data;
}

export interface ResponseErrorType<Data> {
  message: string;
  data?: Data;
}

export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};
