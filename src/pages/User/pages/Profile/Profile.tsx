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
import {string} from "yup";

const userFormSchema = userSchema.pick(['address', 'avatar', 'date_of_birth', 'name', 'phone']);

type UserFormSchema = Pick<UserSchema, 'address' | 'avatar' | 'name' | 'phone' | 'date_of_birth'>;

type UserFormErrorData = Omit<UserFormSchema, 'date_of_birth'> & {
  date_of_birth: string;
};

const dataToString = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
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
        <div className='truncate capitalize text-gray-500 sm:mt-3 sm:w-[20%] sm:text-right' placeholder='profile?.email'>Tên</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm outline-none focus:border-gray-500'
            name='name'
            placeholder='Tên'
            disabled={true}
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
  console.log(profileData)

  const updateProfileMutation = useMutation({
    mutationFn: (body: {phone: string, birthday: string}) => userApi.updateProfile(body),
    onSuccess: ()=>{
      toast.success("Success")
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: (body: FormData) => userApi.uploadAvatar(body)
  });

  const [file, setFile] = useState<File>();
  const [disableSubmit, setDisableSubmit] = useState(false);

  const profile = profileData?.data;
  const previewImage = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return profile?.avatar || userSideNavDefault;
  }, [file, profile]);

  console.log(profile)
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

  const onSubmit = handleSubmit((data) => {
    console.log("SUBMIT TRIGGERED", data);
  });

  useEffect(() => {
    if (profile) {
      setValue('name', profile?.username);
      setValue('phone', profile?.phone);
      setValue('date_of_birth', profile?.birthday ? new Date(profile?.birthday) : new Date(1990, 0, 1));
      setValue('avatar', profile?.avatar);
    }
  }, [profile, setValue]);

  const handleSave = () => {
    const data = methods.getValues(); // Lấy toàn bộ dữ liệu form
    const payload = {
      name: data.name,
      phone: data.phone,
      birthday: dataToString(data.date_of_birth) || "01/01/1991",
      address: data.address,
      avatar: data.avatar
    };

    console.log("Payload chuẩn bị gửi:", payload);
    // bạn có thể gọi API ở đây nếu muốn gửi ngay

    console.log(file)
    if (file) {
      const fileUpload = new FormData();
      fileUpload.append('image', file);

      uploadImageMutation.mutateAsync(fileUpload);
    }

    const body: { phone: string|unknown; birthday: string } = {
      phone: data.phone,
      birthday: data.date_of_birth ? dataToString(data.date_of_birth) : "01/01/1990"
    };

    updateProfileMutation.mutateAsync(body);
    toast.success("Cập nhật hồ sơ thành công", { autoClose: 1000 });
  };

  const onSubmitForm = handleSubmit(async (data) => {
    console.log("BẮT ĐẦU SUBMIT", data);
    setDisableSubmit(true);
    try {
      let uploadAvatar = '';
      if (file) {
        const fileUpload = new FormData();
        fileUpload.append('image', file);

        const uploadResponse = await uploadImageMutation.mutateAsync(fileUpload);
        uploadAvatar = uploadResponse?.data?.image || '';
        console.log("Upload avatar thành công:", uploadAvatar);
      }

      const body: { phone: string; birthday: string } = {
        phone: data.phone,
        birthday: dataToString(data.date_of_birth)
      };

      await updateProfileMutation.mutateAsync(body);
      toast.success("Cập nhật hồ sơ thành công", { autoClose: 1000 });
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
      } else {
        console.error("Lỗi không xác định:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } finally {
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
        <form className='mt-6 flex flex-col-reverse flex-wrap lg:flex-row' onSubmit={onSubmitForm}>
          <div className='flex-grow pt-4 sm:pt-8 md:pr-14'>
            <div className='col-span-12 md:col-span-8'>
              <div className='flex flex-col flex-wrap sm:flex-row'>
                <div className='text-gray-500 sm:w-[20%] sm:text-right '>Username</div>
              </div>
              <Info />

              <div className='flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
                <div className='truncate capitalize text-gray-500 sm:mt-3 sm:w-[20%] sm:text-right'>Địa chỉ
                </div>
                <div className='sm:w-[80%] sm:pl-5'>
                  <select className="h-[40px] w-[32%] rounded-sm border px-3 outline-none hover:border-orange">
                    <option >Chon dc</option>
                    {profile?.addressList?.map((address) => (
                        <option key={address.id} value={address.id}>
                          Tên: {address.name} <br />
                          Địa chỉ: {address.detail || 'Chưa có thông tin'}, {address.commune}, {address.district}, {address.province}
                          <br />
                          Số điện thoại: {address.phone}
                        </option>
                    ))}
                  </select>
                </div>
              </div>
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
                    type='button'
                    onClick={handleSave}
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
                  src={previewImage }
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
