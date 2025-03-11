import { type RegisterOptions, UseFormGetValues } from "react-hook-form";
import * as yup from "yup";

type RulesType = {
  [key in "username" | "password" | "phoneNumber"]?: RegisterOptions;
};

export const getRules = (getValues?: UseFormGetValues<any>): RulesType => ({
  username: {
    required: {
      value: true,
      message: "Please enter username!",
    },
    minLength: {
      value: 3,
      message: "Length is 3-160 characters",
    },
    maxLength: {
      value: 160,
      message: "Length is 3-160 characters",
    },
  },
  password: {
    required: {
      value: true,
      message: "Please enter password!",
    },
    minLength: {
      value: 6,
      message: "Length is 6-160 characters",
    },
    maxLength: {
      value: 160,
      message: "Length is 6-160 characters",
    },
  },
  phoneNumber: {
    required: {
      value: true,
      message: "Please enter phone number!",
    },
    pattern: {
      value: /^\d{10,11}$/,
      message: "Invalid phone number!",
    },
  },
});

export const schema = yup.object({
  username: yup
    .string()
    .required("Vui lòng nhập username!")
    .min(3, "Độ dài từ 3-160 ký tự")
    .max(160, "Độ dài từ 3-160 ký tự"),
  password: yup
    .string()
    .required("Vui lòng nhập password!")
    .min(6, "Độ dài từ 6-160 ký tự")
    .max(160, "Độ dài từ 6-160 ký tự"),
  phoneNumber: yup
    .string()
    .required("Vui lòng nhập số điện thoại!")
    .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ!"),
});

export const userSchema = yup.object({
  username: yup.string().max(160, "Độ dài tối đa là 160 ký tự"),
  phoneNumber: yup.string().max(20, "Độ dài tối đa là 20 ký tự"),
  address: yup.string().max(160, "Độ dài tối đa là 160 ký tự"),
  date_of_birth: yup.date().max(new Date(), "Vui lòng chọn ngày trong quá khứ"),
  avatar: yup.string().max(1000, "Độ dài tối đa là 1000 ký tự"),
  password: schema.fields["password"] as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ""
  >,
  new_password: schema.fields["password"] as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ""
  >,
});

export type UserSchema = yup.InferType<typeof userSchema>;
export type Schema = yup.InferType<typeof schema>;
