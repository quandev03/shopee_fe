import { useEffect } from 'react';

interface Props {
  duration?: number;
  message?: string;
  show: boolean;
  setShow: (value: any) => void;
}

export default function ToastSuccess(props: Props) {
  const { setShow, show, duration, message } = props;

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setShow(false);
      }, duration);
    }
  }, [show, duration, setShow]);

  return show ? (
    <div className='fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2'>
      <div className='rounded-sm bg-black/70 px-6 py-10'>
        <div className='m-auto h-16 w-16 rounded-full bg-[#00bfa5]'>
          <svg
            enableBackground='new 0 0 12 12'
            viewBox='0 0 12 12'
            x={0}
            y={0}
            className='m-auto h-full w-8 fill-white'
          >
            <g>
              <path d='m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c .3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z' />
            </g>
          </svg>
        </div>

        <div className='font-sm mt-6 text-center text-white'>{message || 'Thành công'}</div>
      </div>
    </div>
  ) : null;
}
