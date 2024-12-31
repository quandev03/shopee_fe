import { type RegisterOptions, UseFormGetValues } from 'react-hook-form';
import * as yup from 'yup';

type RulesType = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): RulesType => ({
  email: {
    required: {
      value: true,
      message: 'Please enter email!'
    },
    pattern: {
      value: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: 'Invalid email!'
    },
    maxLength: {
      value: 160,
      message: 'Length is 5-160 characters'
    },
    minLength: {
      value: 5,
      message: 'Length is 5-160 characters'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Please enter password!'
    },
    minLength: {
      value: 6,
      message: 'Length is 6-160 characters'
    },
    maxLength: {
      value: 160,
      message: 'Length is 6-160 characters'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Please enter confirm password!'
    },
    minLength: {
      value: 6,
      message: 'Length is 6-160 characters'
    },
    maxLength: {
      value: 160,
      message: 'Length is 6-160 characters'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Confirm password not match with password!'
        : undefined
  }
});

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Vui lòng nhập password!')
    .min(5, 'Độ dài từ 5-160 ký tự')
    .max(160, 'Đồ dài từ 5-160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại mật khẩu không khớp!');
};

export const schema = yup.object({
  email: yup
    .string()
    .required('Vui lòng nhập email!')
    // .email('Invalid email!')
    .matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email không hợp lệ!')
    .min(5, 'Độ dài từ 5-160 ký tự')
    .max(160, 'Độ dài từ 5-160 ký tự'),
  password: yup
    .string()
    .required('Vui lòng nhập password!')
    .min(6, 'Độ dài từ 6-160 ký tự')
    .max(160, 'Độ dài từ 6-160 ký tự'),
  confirm_password: handleConfirmPasswordYup('password'),
  price_min: yup.string().test({
    name: 'price-not-allow',
    message: 'Giá không hợp lệ',
    test: function (value) {
      const { price_max } = this.parent as { price_min: string; price_max: string };

      if (price_max !== '' && value !== '') {
        return Number(price_max) >= Number(value);
      }

      return price_max !== '' || value !== '';
    }
  }),
  price_max: yup.string().test({
    name: 'price-not-allow',
    message: 'Giá không phù hợp',
    test: function (value) {
      const { price_min } = this.parent as { price_min: string; price_max: string };

      if (price_min !== '' && value !== '') {
        return Number(price_min) <= Number(value);
      }

      return price_min !== '' || value !== '';
    }
  }),
  searchName: yup.string().trim().required('Not valid search name!')
});

export const userSchema = yup.object({
  name: yup.string().max(160, 'Đồ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Đồ dài tối đa là 20 ký tự'),
  address: yup.string().max(20, 'Đồ dài tối đa là 160 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Vui lòng chọn ngày trong quá khứ'),
  avatar: yup.string().max(1000, 'Đồ dài tối đa là 1000 ký tự'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('new_password') as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >
});

export type UserSchema = yup.InferType<typeof userSchema>;

export type Schema = yup.InferType<typeof schema>;
