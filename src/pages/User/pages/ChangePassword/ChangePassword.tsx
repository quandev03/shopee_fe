import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import omit from 'lodash/omit';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { BodyDataProfile, userApi } from 'src/api/profile.api';
import Button from 'src/components/Button';
import Input from 'src/components/Form/Input';
import { ResponseErrorType } from 'src/@types/utils.type';
import { UserSchema, userSchema } from 'src/utils/rules';
import { isAxiosErrorUnprocessableEntity } from 'src/utils/utils';
import { Helmet } from 'react-helmet-async';

const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password']);
type PassWordData = Pick<UserSchema, 'password' | 'confirm_password' | 'new_password'>;

export default function ChangePassword() {
  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    reset
  } = useForm<PassWordData>({
    defaultValues: {
      confirm_password: '',
      new_password: '',
      password: ''
    },
    resolver: yupResolver(passwordSchema)
  });

  const [disableSubmit, setDisableSubmit] = useState(false);

  const updatePassWordMutation = useMutation({
    mutationFn: (body: BodyDataProfile) => userApi.updateProfile(body)
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setDisableSubmit(true);

      const res = await updatePassWordMutation.mutateAsync(omit(data, ['confirm_password']) as BodyDataProfile);

      toast.success(res.data.message, { autoClose: 500 });
      setDisableSubmit(false);
      reset();
    } catch (error) {
      if (isAxiosErrorUnprocessableEntity<ResponseErrorType<PassWordData>>(error)) {
        const formError = error.response?.data.data;

        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof PassWordData, {
              message: formError[key as keyof PassWordData],
              type: 'Server'
            });
          });
        }
      }
      setDisableSubmit(false);
    }
  });

  return (
    <div className='bg-white px-6 pb-16 pt-4 text-sm shadow-sm'>
      <Helmet>
        <title>Đổi mật khẩu</title>
        <meta name='description' content='Đổi mật khẩu tài khoản shopee' />
      </Helmet>
      <div>
        <h1 className='text-lg uppercase'>Đổi mật khẩu</h1>
        <h1 className='text-gray-600'>Quản lý thông tin hồ sơ để bảo mật tài khoản</h1>
      </div>

      <div className='my-4 h-[1px] w-full bg-gray-200' />

      <form onSubmit={onSubmit}>
        <div className='mr-auto max-w-3xl'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='mt-2 truncate capitalize text-gray-500 sm:w-[25%] sm:text-right lg:w-[20%]'>
              Mật khẩu hiện tại
            </div>
            <div className='sm:w-[75%] sm:pl-4 lg:w-[80%]'>
              <Input
                placeholder='Mật khẩu hiện tại'
                type='password'
                register={register}
                classNameInput='sm:mt-0 mt-2 w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm outline-none focus:border-gray-500'
                name='password'
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <div className='flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
            <div className='mt-2 truncate capitalize text-gray-500 sm:w-[25%] sm:text-right lg:w-[20%]'>
              Mật khẩu mới
            </div>
            <div className='sm:w-[75%] sm:pl-4 lg:w-[80%]'>
              <Input
                placeholder='Mật khẩu mới'
                type='password'
                register={register}
                classNameInput='sm:mt-0 mt-2 w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm outline-none focus:border-gray-500'
                name='new_password'
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className='flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
            <div className='mt-2 truncate capitalize text-gray-500 sm:w-[25%] sm:text-right lg:w-[20%]'>
              Xác nhận mật khẩu
            </div>
            <div className='sm:w-[75%] sm:pl-4 lg:w-[80%]'>
              <Input
                placeholder='Xác nhận mật khẩu'
                type='password'
                register={register}
                classNameInput='sm:mt-0 mt-2 w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm outline-none focus:border-gray-500'
                name='confirm_password'
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>

          <div className='flex flex-col flex-wrap sm:mt-5 sm:flex-row'>
            <div className='mt-2 truncate capitalize text-gray-500 sm:w-[25%] sm:text-right lg:w-[20%]' />
            <div className='flex sm:w-[75%] sm:pl-4 lg:w-[80%]'>
              <Button
                disabled={disableSubmit}
                className='rounded-sm bg-orange px-6 py-3 text-white hover:bg-orange/80'
                type='submit'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
