import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Input from 'src/components/Form/Input';
import { Schema, schema } from 'src/utils/rules';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { authApi } from 'src/api/auth.api';
import omit from 'lodash/omit';
import { isAxiosErrorUnprocessableEntity } from 'src/utils/utils';
import { ResponseErrorType } from 'src/@types/utils.type';
import { useContext } from 'react';
import { AppContext } from 'src/contexts/app.context';
import Button from 'src/components/Button';
import { Helmet } from 'react-helmet-async';

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>;

const registerSchema = schema.pick(['confirm_password', 'email', 'password']);

export default function Register() {
  const {
    handleSubmit,
    register,
    setError,
    //watch, //method này dùng để lấy dữ liệu trong ô input nhưng làm cho component re-render trong suốt quá trình change input
    //getValues, //method này dùng để lấy dữ liệu trong ô input và ko làm cho component re-render
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  });

  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => {
      return authApi.registerAccount(body);
    }
  });

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password']);
    registerAccountMutation.mutate(body, {
      onSuccess: (result) => {
        const { access_token, user } = result.data.data;

        setIsAuthenticated(Boolean(access_token));
        setProfile(user);
      },
      onError: (error) => {
        if (isAxiosErrorUnprocessableEntity<ResponseErrorType<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data;

          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(
                key as keyof Omit<FormData, 'confirm_password'>,
                {
                  message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                  type: 'Server'
                },
                {
                  shouldFocus: true
                }
              );
            });
          }
        }
      }
    });
  });

  return (
    <div className='flex items-center bg-orange bg-contain lg:h-auth__hero lg:min-h-auth_hero lg:bg-[url("https://down-vn.img.susercontent.com/file/sg-11134004-7qvcy-lfuqe4hftedq21")] lg:bg-center lg:bg-no-repeat lg:py-10'>
      <Helmet>
        <title>Đăng ký | Shopee Clone</title>
        <meta name='description' content='Đăng ký tài khoản shopee để bắt đầu mua sắm' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='bg-white p-6 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='form__title text-xl lg:text-2xl'>Đăng ký</div>
              <div className='mt-3'>
                <Input
                  name='email'
                  placeholder='Email'
                  errorMessage={errors.email?.message}
                  register={register}
                  type='email'
                />
              </div>

              <div className='mt-2'>
                <Input
                  name='password'
                  type='password'
                  errorMessage={errors.password?.message}
                  placeholder='Password'
                  register={register}
                  autoComplete='on'
                  classNameOpenEye='absolute right-[6px] top-[12px] h-5 w-5 cursor-pointer'
                />
              </div>

              <div className='mt-2'>
                <Input
                  name='confirm_password'
                  register={register}
                  placeholder='Confirm password'
                  type='password'
                  errorMessage={errors.confirm_password?.message}
                  autoComplete='on'
                  classNameOpenEye='absolute right-[6px] top-[12px] h-5 w-5 cursor-pointer'
                />
              </div>

              <Button
                isLoading={registerAccountMutation.isLoading}
                disabled={registerAccountMutation.isLoading}
                type='submit'
                className='mt-5 flex w-full items-center justify-center rounded-sm bg-orange px-2 py-4 text-white'
              >
                Đăng ký
              </Button>

              <div className='mt-8 flex justify-center'>
                <span className='mr-1 text-gray-400'>Bạn đã có tài khoản?</span>
                <Link to='/login' className='text-orange'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
