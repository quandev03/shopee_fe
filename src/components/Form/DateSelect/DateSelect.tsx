import range from 'lodash/range';
import React, { useEffect, useState } from 'react';

interface Props {
  className?: string;
  onChange?: (value: Date) => void;
  value?: Date;
  classNameError?: string;
  errorMessage?: string;
}

export default function DateSelect(props: Props) {
  const {
    className = 'flex sm:w-[80%] sm:pl-5 flex-col',
    classNameError = 'mt-1 min-h-[1.25rem] text-red-500',
    errorMessage,
    onChange,
    value
  } = props;

  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1925
  });


  const [quantityDayInMonth, setQuantitiesDayInMonth]= useState(32)

  function isLeapYear(year: number) {
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
      return true;
    }
    return false;
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

    const { name, value } = event.target;

    const newDate = {
      ...date,
      [name]: value
    };

    setDate(newDate);

    isLeapYear(newDate.year)

    if (newDate.month == 1 && isLeapYear(newDate.year) == false) {
      setQuantitiesDayInMonth(29);
    }
    else if (newDate.month == 1 && isLeapYear(newDate.year) == true) {
      setQuantitiesDayInMonth(30);
    }
    else if (newDate.month==3||newDate.month==5||newDate.month==8||newDate.month==10){
      setQuantitiesDayInMonth(31)
    }
    else (
      setQuantitiesDayInMonth(32)
    )
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date));
  };

  useEffect(() => {
    if (value) {
      setDate((prev) => ({
        ...prev,
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      }));
      console.log(value);
      console.log(date.year)
      console.log(isLeapYear(date.year))
    }
  }, [value]);


  return (
    <div className={className}>

      <div className='flex w-full justify-between gap-4'>
        <select
          onChange={handleChange}
          name='date'
          value={value?.getDate() || date.date}
          className='h-[40px] w-[32%] rounded-sm border px-3 outline-none hover:border-orange'
        >
          <option disabled>Ngày</option>
          {range(1, quantityDayInMonth).map((value) => (
            <option value={value} key={value} className='hover:bg-transparent hover:text-orange'>
              {value}
            </option>
          ))}
        </select>
        <select
          onChange={handleChange}
          name='month'
          value={value?.getMonth() || date.month}
          className='h-[40px] w-[32%] rounded-sm border px-3 outline-none hover:border-orange'
        >
          <option disabled>Tháng</option>
          {range(0, 12).map((value) => (
            <option value={value} key={value} className='hover:bg-transparent hover:text-orange'>
              Tháng {value+1}
            </option>
          ))}
        </select>
        <select
          onChange={handleChange}
          name='year'
          value={value?.getFullYear() || date.year}
          className='h-[40px] w-[32%] rounded-sm border px-3 outline-none hover:border-orange'
        >
          <option disabled>Năm</option>
          {range(new Date().getFullYear(), new Date().getFullYear() -100, -1).map((value) => (
            <option value={value} key={value} className='hover:bg-transparent hover:text-orange'>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
}
