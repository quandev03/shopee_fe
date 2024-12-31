import React, { InputHTMLAttributes, useState } from 'react';

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  classNameInput?: string;
  classNameError?: string;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
  props: InputNumberProps,
  ref
) {
  const {
    errorMessage,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 shadow-sm outline-none focus:border-gray-500',
    classNameError = 'mt-1 min-h-[1.25rem] text-red-500',
    className,
    onChange,
    value = '',
    ...rest
  } = props;

  const [localValue, setLocalValue] = useState<string>(value as string);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (/^\d+$/.test(value) || value === '') {
      //Thực thi onChange callback từ bên ngoài  truyền vào props
      onChange && onChange(event);

      //Cập nhật localValue
      setLocalValue(value);
    }
  };

  return (
    <React.Fragment>
      <div className={className}>
        <input value={value || localValue} className={classNameInput} {...rest} ref={ref} onChange={handleChange} />

        <div className={classNameError}>{errorMessage}</div>
      </div>
    </React.Fragment>
  );
});

export default InputNumber;
