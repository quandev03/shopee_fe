import { useState } from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import classNames from 'classnames';
import { Link, createSearchParams } from 'react-router-dom';
import { purchasesApi } from 'src/api/purchases.api';
import nopurchase from 'src/assets/images/no-purchases.png';
import { path } from 'src/constants/path';
import { purchasesStatus } from 'src/constants/purchases';
import { useQueryParams } from 'src/hooks/useQueryParams';
import { PurchaseListStatus } from 'src/@types/purchases.type';
import { formatCurrency, generateNameId } from 'src/utils/utils';
import { Helmet } from 'react-helmet-async';
import {Rate, Modal, message} from 'antd';

const tabArrayData = [
  {
    status: purchasesStatus.all,
    label: 'Tất cả'
  },
  {
    status: purchasesStatus.waitForConfirmation,
    label: 'Chờ xác nhận'
  },
  {
    status: purchasesStatus.waitForPicking,
    label: 'Chờ lấy hàng'
  },
  {
    status: purchasesStatus.inProgress,
    label: 'Đang giao'
  },
  {
    status: purchasesStatus.delivered,
    label: 'Đã giao'
  },
  {
    status: purchasesStatus.cancelled,
    label: 'Đã hủy'
  }
];

export default function PurchaseHistory() {
  const params: { status?: string } = useQueryParams();
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [star, setStar] = useState(0)
  const [currentId, setCurrentId] = useState(null)

  const status: number = Number(params.status) || purchasesStatus.all;
  console.log(status)
  const { data, isLoading } = useQuery({
    queryKey: ['purchases', status],
    queryFn: () => purchasesApi.getPurchasesStatus(status),
    retry: 0
  });

  const dataPurchases = data?.data;
  console.log(dataPurchases)

  console.log(dataPurchases)

  const handleRating = (star: number) => {
    console.log(`Rated with ${star} stars`);
    setStar(star)
    // You can handle the rating here, such as sending it to the API
      setIsModalOpen(true);
     // Close the popup after rating

  };
  const rate = useMutation({
    mutationFn:(param:{orderId: string, rate: number}) => purchasesApi.rating(param),
    onSuccess:()=>{message.success("Đánh giá thành công")}
  })

  const handleOk = () => {
    console.log(star)
    rate.mutate({orderId: currentId, rate: star})

    setIsModalOpen(false);
    setShowRatingPopup(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setShowRatingPopup(false);
  };

  const handleConfirmRating = (star: number) => {
    console.log(`Rating confirmed with ${star} stars`);
    console.log("id: " + currentId)
    setStar(star)
    setIsModalOpen(true)

    // Call API or save the rating here
    // setShowRatingPopup(false); // Close the popup after confirmation
  };

  return (
    <div className='relative'>
      <Helmet>
        <title>Đơn mua</title>
        <meta name='description' content='Thông tin đơn mua của tôi trên shopee' />
      </Helmet>
      <div className='overflow-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky left-0 top-0 flex items-center justify-center'>
            {tabArrayData.map((tab) => (
              <Link
                key={tab.status}
                to={{
                  pathname: path.purchaseHistory,
                  search: createSearchParams({
                    ...params,
                    status: String(tab.status)
                  }).toString()
                }}
                className={classNames('flex-1 border-b-[2px] bg-white py-4 text-center', {
                  'border-b-orange': status === tab.status,
                  'border-b-gray-300': status !== tab.status
                })}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {!isLoading &&
            (dataPurchases && dataPurchases.length ? (
              dataPurchases?.map((purchase) => (
                <div key={purchase?.orderId} className='mt-3 bg-white px-6 py-4 shadow-sm'>
                  <Link
                    to={`${path.home}${generateNameId({ name: purchase?.productDTO?.nameProduct, id: purchase?.productDTO?.id })}`}
                    className='flex'
                  >
                    <div className='h-24 w-24 flex-shrink-0'>
                      <img src={purchase?.productDTO?.image} alt={purchase?.productDTO?.nameProduct} className='h-full w-full' />
                    </div>
                    <div className='ml-4 mr-4 max-w-[1000px] text-gray-700'>
                      <p>{purchase?.productDTO?.nameProduct}</p>
                      <p className='my-1 text-sm text-gray-400'>Phân loại hàng: {purchase?.productDTO?.category?.name}</p>
                      <span className='text-sm'>x{purchase?.quantity}</span>
                    </div>
                    <div className='ml-auto'>
                      <div className='flex h-full items-center justify-end gap-2'>
                        <div className='max-w-[50%] truncate text-gray-500 line-through'>
                          <span>₫</span>
                          <span className='text-sm'>{formatCurrency(purchase?.productDTO?.price)}</span>
                        </div>

                        <div className='text-orange'>
                          <span>₫</span>
                          <span className='text-sm'>{formatCurrency(purchase?.productDTO?.price -(purchase?.productDTO?.price  * purchase?.discount))}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className='my-4 h-[1px] w-full bg-gray-200' />

                  {Number(purchase?.statusOrder) === 3 && (
                      <div className="flex justify-end mt-4">
                        <button
                            onClick={() => {
                              setShowRatingPopup(true)
                              setCurrentId(purchase?.orderId)
                            }}
                            className="px-4 py-2 bg-[#FF5733] text-white rounded-lg z-index"
                        >
                          Đánh giá sản phẩm
                        </button>
                      </div>
                  )}

                  <div className='flex items-center justify-end'>
                    <div className='flex items-center gap-2 text-sm text-gray-700'>
                      <svg className='h-4 w-4' viewBox='0 0 253 263' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M126.5 0.389801C126.5 0.389801 82.61 27.8998 5.75 26.8598C5.08763 26.8507 4.43006 26.9733 3.81548 27.2205C3.20091 27.4677 2.64159 27.8346 2.17 28.2998C1.69998 28.7657 1.32713 29.3203 1.07307 29.9314C0.819019 30.5425 0.688805 31.198 0.689995 31.8598V106.97C0.687073 131.07 6.77532 154.78 18.3892 175.898C30.003 197.015 46.7657 214.855 67.12 227.76L118.47 260.28C120.872 261.802 123.657 262.61 126.5 262.61C129.343 262.61 132.128 261.802 134.53 260.28L185.88 227.73C206.234 214.825 222.997 196.985 234.611 175.868C246.225 154.75 252.313 131.04 252.31 106.94V31.8598C252.31 31.1973 252.178 30.5414 251.922 29.9303C251.667 29.3191 251.292 28.7649 250.82 28.2998C250.35 27.8358 249.792 27.4696 249.179 27.2225C248.566 26.9753 247.911 26.852 247.25 26.8598C170.39 27.8998 126.5 0.389801 126.5 0.389801Z'
                          fill='#ee4d2d'
                        />
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M207.7 149.66L119.61 107.03C116.386 105.472 113.914 102.697 112.736 99.3154C111.558 95.9342 111.772 92.2235 113.33 88.9998C114.888 85.7761 117.663 83.3034 121.044 82.1257C124.426 80.948 128.136 81.1617 131.36 82.7198L215.43 123.38C215.7 120.38 215.85 117.38 215.85 114.31V61.0298C215.848 60.5592 215.753 60.0936 215.57 59.6598C215.393 59.2232 215.128 58.8281 214.79 58.4998C214.457 58.1705 214.063 57.909 213.63 57.7298C213.194 57.5576 212.729 57.4727 212.26 57.4798C157.69 58.2298 126.5 38.6798 126.5 38.6798C126.5 38.6798 95.31 58.2298 40.71 57.4798C40.2401 57.4732 39.7735 57.5602 39.3376 57.7357C38.9017 57.9113 38.5051 58.1719 38.1709 58.5023C37.8367 58.8328 37.5717 59.2264 37.3913 59.6604C37.2108 60.0943 37.1186 60.5599 37.12 61.0298V108.03L118.84 147.57C121.591 148.902 123.808 151.128 125.129 153.884C126.45 156.64 126.797 159.762 126.113 162.741C125.429 165.72 123.755 168.378 121.363 170.282C118.972 172.185 116.006 173.221 112.95 173.22C110.919 173.221 108.915 172.76 107.09 171.87L40.24 139.48C46.6407 164.573 62.3785 186.277 84.24 200.16L124.49 225.7C125.061 226.053 125.719 226.24 126.39 226.24C127.061 226.24 127.719 226.053 128.29 225.7L168.57 200.16C187.187 188.399 201.464 170.892 209.24 150.29C208.715 150.11 208.2 149.9 207.7 149.66Z'
                          fill='#fff'
                        />
                      </svg>
                      <span>Thành tiền: </span>
                    </div>

                    <div className='ml-2 text-xl text-orange'>
                      <span>₫</span>
                      {formatCurrency((purchase?.quantity * purchase?.productDTO?.price) - (purchase?.quantity * purchase?.productDTO?.price)* purchase?.discount)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='mt-3 flex h-[500px] w-full flex-col items-center justify-center bg-white shadow-sm'>
                <div className='h-28 w-28 '>
                  <img src={nopurchase} alt='no-purchase' className='h-full w-full' />
                </div>

                <span className='mt-3 text-lg text-gray-700'>Chưa có đơn hàng</span>
              </div>
            ))}
        </div>
      </div>
      {showRatingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl mb-4">Đánh giá sản phẩm</h3>
            <Rate onChange={handleConfirmRating}/>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowRatingPopup(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Bạn có chắc về đánh giá này</p>
      </Modal>

    </div>
  );
}
