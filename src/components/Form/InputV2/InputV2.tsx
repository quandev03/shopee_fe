import React, { InputHTMLAttributes, useState } from 'react';
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form';

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  classNameInput?: string;
  classNameError?: string;
}

function InputV2<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: UseControllerProps<TFieldValues, TName> & InputNumberProps
) {
  const {
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 shadow-sm outline-none focus:border-gray-500',
    classNameError = 'mt-1 min-h-[1.25rem] text-red-500',
    className,
    onChange,
    type,
    ...rest
  } = props;

  const { field, fieldState } = useController(props);

  const [localValue, setLocalValue] = useState<string>(field.value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value;

    const numberCondition = type === 'number' && (/^\d+$/.test(valueFromInput) || valueFromInput === '');

    if (type !== 'number' || numberCondition) {
      //Cập nhật localValue
      setLocalValue(valueFromInput);

      //Thực thi onChange của react hook form
      field.onChange(event);

      //Thực thi onChange callback từ bên ngoài  truyền vào props
      onChange && onChange(event);
    }
  };

  return (
    <React.Fragment>
      <div className={className}>
        <input
          className={classNameInput}
          {...rest}
          {...field}
          ref={field.ref}
          onChange={handleChange}
          value={field.value || localValue}
        />

        <div className={classNameError}>{fieldState.error?.message}</div>
      </div>
    </React.Fragment>
  );
}

export default InputV2;
