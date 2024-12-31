import React, { Fragment, useRef } from 'react';
import { toast } from 'react-toastify';
import config from 'src/constants/config';

interface Props {
  onChange?: (file?: File) => void;
}

export default function InputAvatar({ onChange }: Props) {
  const uploadImageRef = useRef<HTMLInputElement>(null);

  const changeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFromInput = event.target.files?.[0];

    if (
      imageFromInput &&
      (imageFromInput.size >= config.maxSizeUploadAvatar || !imageFromInput.type.includes('image'))
    ) {
      toast.error('Dụng lượng file tối đa 1 MB, Định dạng:.JPEG, .PNG', {
        autoClose: 2000
      });
    } else {
      onChange && onChange(imageFromInput);
    }
  };

  const handleUpload = () => {
    uploadImageRef.current?.click();
  };

  return (
    <Fragment>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={uploadImageRef}
        onChange={changeImage}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (event.target as any).value = null;
        }}
      />

      <button
        type='button'
        className='mx-auto mb-3 w-[100px] rounded-sm border border-gray-200 bg-white py-2 text-center capitalize'
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </Fragment>
  );
}
