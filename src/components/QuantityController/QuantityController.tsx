import { useState } from 'react';
import InputNumber, { InputNumberProps } from '../Form/InputNumber';

interface Props extends InputNumberProps {
  max?: number;
  onIncrease?: (value: number) => void;
  onDecrease?: (value: number) => void;
  onType?: (value: number) => void;
  onFocusOut?: (value: number) => void;
  classNameWrapper?: string;
}

export default function QuantityController({
  onDecrease,
  onIncrease,
  onType,
  onFocusOut,
  max,
  value,
  classNameWrapper = 'ml-10',
  ...rest
}: Props) {
  const [localValue, setLocalValue] = useState<number>(Number(value || 1));

  const increase = () => {
    let _value = Number(value || localValue) + 1;

    if (max !== undefined && _value > max) {
      _value = max;
    }

    onIncrease && onIncrease(_value);
    setLocalValue(_value);
  };

  const decrease = () => {
    let _value = Number(value || localValue) - 1;
    if (_value < 1) {
      _value = 1;
    }

    onDecrease && onDecrease(_value);
    setLocalValue(_value);
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value);

    if (max !== undefined && _value > max) {
      _value = max;
    } else if (_value <= 0) {
      _value = 1;
    }

    onType && onType(_value);
    setLocalValue(_value);
  };

  const handleBlurInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _value = Number(event.target.value);

    onFocusOut && onFocusOut(_value);
  };

  return (
    <div className={`flex items-center ${classNameWrapper}`}>
      <button className='border-1 h-8 w-8 border border-r-0 text-xl text-gray-500 outline-none' onClick={decrease}>
        -
      </button>
      <InputNumber
        classNameError='hidden'
        classNameInput='border-1 text w-[4rem] border px-2 h-8 text-center'
        value={value || localValue}
        onChange={handleChangeInput}
        onBlur={handleBlurInput}
        {...rest}
      />
      <button className='border-1 h-8 w-8 border border-l-0 text-xl text-gray-500 outline-none' onClick={increase}>
        +
      </button>
    </div>
  );
}
