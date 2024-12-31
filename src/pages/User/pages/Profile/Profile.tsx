import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { BodyDataProfile, userApi } from 'src/api/profile.api';
import userSideNavDefault from 'src/assets/images/userSideNavDefault.svg';
import Button from 'src/components/Button';
import DateSelect from 'src/components/Form/DateSelect';
import Input from 'src/components/Form/Input';
import InputAvatar from 'src/components/Form/InputAvatar';
import InputNumber from 'src/components/Form/InputNumber';
import { AppContext } from 'src/contexts/app.context';
import { ResponseErrorType } from 'src/@types/utils.type';
import { setProfileToLS } from 'src/utils/auth';
import { UserSchema, userSchema } from 'src/utils/rules';
import { generateImageUrl, isAxiosErrorUnprocessableEntity } from 'src/utils/utils';
import { Helmet } from 'react-helmet-async';

const userFormSchema = userSchema.pick(['address', 'avatar', 'date_of_birth', 'name', 'phone']);

type UserFormSchema = Pick<UserSchema, 'address' | 'avatar' | 'name' | 'phone' | 'date_of_birth'>;

type UserFormErrorData = Omit<UserFormSchema, 'date_of_birth'> & {
  date_of_birth: string;
};

function Info() {
  const {
    control,
    formState: { errors },
    register
  } = useFormContext<UserFormSchema>();

  return (
    <Fragment>
      <Helmet>
        <title>Tài khoản của tôi</title>
        <meta name='description' content='Xem thông tin tài khoản của tôi' />
      </Helmet>
      <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
        <div className='truncate capitalize text-gray-500 sm:mt-3 sm:w-[20%] sm:text-right'>Tên</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm outline-none focus:border-gray-500'
            name='name'
            placeholder='Tên'
            errorMessage={errors.name?.message}
            register={register}
          />
        </div>
      </div>
      <div className='flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
        <div className='truncate capitalize text-gray-500 sm:mt-3 sm:w-[20%] sm:text-right'>Số điện thoại</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => {
              return (
                <InputNumber
                  placeholder='Số điện thoại'
                  classNameInput='w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm outline-none focus:border-gray-500'
                  errorMessage={errors.phone?.message}
                  {...field}
                  onChange={field.onChange}
                />
              );
            }}
          />
        </div>
      </div>
      <div className='flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
        <div className='truncate capitalize text-gray-500 sm:mt-3 sm:w-[20%] sm:text-right'>Địa chỉ</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm outline-none focus:border-gray-500'
            name='address'
            placeholder='Địa chỉ'
            errorMessage={errors.address?.message}
            register={register}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default function Profile() {
  const { setProfile } = useContext(AppContext);
  const queryClient = useQueryClient();

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  });

  const updateProfileMutation = useMutation({
    mutationFn: (body: BodyDataProfile) => userApi.updateProfile(body)
  });

  const uploadImageMutation = useMutation({
    mutationFn: (body: FormData) => userApi.uploadAvatar(body)
  });

  const [file, setFile] = useState<File>();
  const [disableSubmit, setDisableSubmit] = useState(false);

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : '';
  }, [file]);

  const profile = profileData?.data.data;

  const methods = useForm<UserFormSchema>({
    defaultValues: {
      address: '',
      avatar: '',
      name: '',
      phone: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(userFormSchema)
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    setError
  } = methods;

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name);
      setValue('phone', profile.phone);
      setValue('address', profile.address);
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1));
      setValue('avatar', profile.avatar);
    }
  }, [profile, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let uploadAvatar = '';

      setDisableSubmit(true);

      if (file) {
        const fileUpload = new FormData();

        fileUpload.append('image', file);

        const res = await uploadImageMutation.mutateAsync(fileUpload);
        uploadAvatar = res.data.data;
      }

      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: uploadAvatar || profile?.avatar
      });

      refetch();
      toast.success(res.data.message, { autoClose: 500 });
      setProfile(res.data.data);
      setProfileToLS(res.data.data);
      setDisableSubmit(false);
    } catch (error) {
      if (isAxiosErrorUnprocessableEntity<ResponseErrorType<UserFormErrorData>>(error)) {
        const formError = error.response?.data.data;

        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof UserFormErrorData, {
              message: formError[key as keyof UserFormErrorData],
              type: 'Server'
            });
          });
        }
      }
      setDisableSubmit(false);
    }
  });

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, [queryClient]);

  const handleChangeFile = (file?: File) => {
    setFile(file);
  };

  return (
    <div className='bg-white px-6 pb-16 pt-4 text-sm shadow-sm'>
      <div>
        <h1 className='text-lg uppercase'>Hồ sơ của tôi </h1>
        <p className='text-gray-600'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <div className='my-4 h-[1px] w-full bg-gray-200' />

      <FormProvider {...methods}>
        <form className='mt-6 flex flex-col-reverse flex-wrap lg:flex-row' onSubmit={onSubmit}>
          <div className='flex-grow pt-4 sm:pt-8 md:pr-14'>
            <div className='col-span-12 md:col-span-8'>
              <div className='flex flex-col flex-wrap sm:flex-row'>
                <div className='text-gray-500 sm:w-[20%] sm:text-right '>Email</div>
                <div className='sm:w-[80%] sm:pl-5'>{profile?.email}</div>
              </div>
              <Info />
              <div className='flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
                <div className='truncate capitalize text-gray-500 sm:mt-3 sm:w-[20%] sm:text-right'>Ngày sinh</div>
                <Controller
                  control={control}
                  name='date_of_birth'
                  render={({ field }) => (
                    <DateSelect
                      onChange={field.onChange}
                      value={field.value}
                      errorMessage={errors.date_of_birth?.message}
                    />
                  )}
                />
              </div>

              <div className='flex flex-col flex-wrap sm:mt-5 sm:flex-row'>
                <div className='truncate capitalize text-gray-500 sm:mt-3 sm:w-[20%] sm:text-right' />
                <div className='flex sm:w-[80%] sm:pl-5'>
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
          </div>

          <div>
            <div className='m-auto flex w-[180px] flex-col justify-center border-b border-b-gray-200 pb-4 lg:w-72 lg:border-b-0 lg:border-l lg:border-l-gray-200'>
              <div className='m-auto my-3 h-[100px] w-[100px] md:mb-6 md:mt-8'>
                <img
                  src={previewImage || generateImageUrl(profile?.avatar) || userSideNavDefault}
                  alt='avatar'
                  className='h-full w-full rounded-full object-cover'
                />
              </div>

              <InputAvatar onChange={handleChangeFile} />

              <span className='text-center text-gray-500'>Dụng lượng file tối đa 1 MB </span>
              <span className='text-center text-gray-500'>Định dạng:.JPEG, .PNG</span>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
