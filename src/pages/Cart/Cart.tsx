import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import keyBy from 'lodash/keyBy';
import React, { useContext, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productApi } from 'src/api/product.api';
import { purchasesApi } from 'src/api/purchases.api';
import noproduct from 'src/assets/images/no-product.png';
import Button from 'src/components/Button';
import QuantityController from 'src/components/QuantityController';
import { path } from 'src/constants/path';
import { purchasesStatus } from 'src/constants/purchases';
import { AppContext } from 'src/contexts/app.context';
import { ProductListConfig } from 'src/@types/product.type';
import { ProductCart, Purchases } from 'src/@types/purchases.type';
import { formatCurrency, formatNumberToSocialStyle, generateNameId, randomInteger } from 'src/utils/utils';
import Product from '../ProductList/components/Product';
import { Helmet } from 'react-helmet-async';

const randomPage = randomInteger(1, 3).toString();

export default function Cart() {
  const { extendsPurchases, setExtendsPurchases } = useContext(AppContext);

  const status = purchasesStatus.inCart;

  const queryClient = useQueryClient();

  const queryConfig: ProductListConfig = { page: randomPage, limit: '12' };

  const location = useLocation();

  const purchaseChosenFromProductDetail = (location.state as { purchaseId: string } | null)?.purchaseId;

  const { data: purchasesData, refetch } = useQuery({
    queryKey: ['purchasesCart', { status }],
    queryFn: () => purchasesApi.getPurchases({ status })
  });

  const { data: productRelateData } = useQuery({
    queryKey: ['productRelate', queryConfig],
    queryFn: () => productApi.getProductList(queryConfig)
  });

  const productRelateList = productRelateData?.data.data;

  const updatePurchaseMutation = useMutation({
    mutationFn: (body: ProductCart) => {
      return purchasesApi.updatePurchases(body);
    },
    onSuccess: () => {
      refetch();
    }
  });

  const deletePurchaseMutation = useMutation({
    mutationFn: (data: string[]) => purchasesApi.deletePurchases(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchasesCart', { status }] });
    }
  });

  const buyProductMutation = useMutation({
    mutationFn: (body: ProductCart[]) => purchasesApi.buyProducts(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchasesCart', { status }] });
      toast.success(data.data.message, {
        position: 'top-center'
      });
    }
  });

  const productInCartData = purchasesData?.data.data;
  const isCheckAllPurchase = useMemo(() => extendsPurchases.every((purchase) => purchase.checked), [extendsPurchases]);
  const checkedPurchases = useMemo(() => extendsPurchases.filter((purchase) => purchase.checked), [extendsPurchases]);
  const checkedPurchasesCount = checkedPurchases.length;
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((total, purchase) => {
        return total + purchase.buy_count * purchase.product.price;
      }, 0),
    [checkedPurchases]
  );

  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((total, purchase) => {
        return total + (purchase.product.price_before_discount - purchase.product.price) * purchase.buy_count;
      }, 0),
    [checkedPurchases]
  );

  useEffect(() => {
    setExtendsPurchases((prev) => {
      const purchasesObject = keyBy(prev, '_id');
      return (
        productInCartData?.map((purchase) => {
          const isChosenPurchase = purchaseChosenFromProductDetail === purchase._id;

          return {
            ...purchase,
            checked: isChosenPurchase || Boolean(purchasesObject[purchase._id]?.checked),
            disabled: false
          };
        }) || []
      );
    });
  }, [productInCartData, purchaseChosenFromProductDetail, setExtendsPurchases]);

  useEffect(() => {
    return () => {
      history.replaceState(null, '');
    };
  }, []);

  const toggleCheckAllPurchase = () => {
    setExtendsPurchases(
      produce((draft) => {
        return draft.map((purchase) => ({
          ...purchase,
          checked: !isCheckAllPurchase
        }));
      })
    );
  };

  const checkPurchase = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendsPurchases(
      produce((draft) => {
        const purchaseFinded = draft[index];
        purchaseFinded.checked = event.target.checked;
      })
    );
  };

  const handleQuantity = (productIndex: number, value: number, enable: boolean) => {
    if (!enable) return;

    setExtendsPurchases(
      produce((draft) => {
        const purchaseFinded = draft[productIndex];
        purchaseFinded.disabled = true;
      })
    );

    updatePurchaseMutation.mutate({
      buy_count: value,
      product_id: extendsPurchases[productIndex].product._id
    });
  };

  const handleTypeQuantity = (productIndex: number, value: number) => {
    setExtendsPurchases(
      produce((draft) => {
        const purchaseFinded = draft[productIndex];
        purchaseFinded.buy_count = value;
      })
    );
  };

  const handleDeletePurchase = (productIndex: number) => () => {
    const purchase = extendsPurchases[productIndex];
    deletePurchaseMutation.mutate([purchase._id]);
  };

  const handleDeleteManyPurchases = () => {
    const ids = checkedPurchases.map((purchase) => purchase._id);
    deletePurchaseMutation.mutate(ids);
  };

  const handleBuyProduct = () => {
    const listProduct: ProductCart[] = checkedPurchases.map((purchase) => ({
      product_id: purchase.product._id,
      buy_count: purchase.buy_count
    }));

    buyProductMutation.mutate(listProduct);
  };

  return (
    <div className='bg-neutral-100'>
      <Helmet>
        <title>Giỏ hàng</title>
        <meta name='description' content='Giỏ hàng của bạn' />
      </Helmet>
      <div className='container'>
        {extendsPurchases.length ? (
          <>
            <div className='overflow-auto text-sm'>
              <div className='min-w-[1200px]'>
                <div className='grid grid-cols-12 bg-white px-12 py-5 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <input
                        checked={isCheckAllPurchase}
                        onChange={toggleCheckAllPurchase}
                        type='checkbox'
                        className='h-5 w-5 rounded border accent-orange outline-none'
                      />
                      <div className='ml-4 capitalize'>sản phẩm</div>
                    </div>
                  </div>

                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 items-center text-gray-500'>
                      <div className='col-span-2 text-center capitalize'>Đơn giá</div>
                      <div className='col-span-1 text-center capitalize'>số lượng</div>
                      <div className='col-span-1 text-center capitalize'>số tiền</div>
                      <div className='col-span-1 text-center capitalize'>thao tác</div>
                    </div>
                  </div>
                </div>

                {extendsPurchases?.map((purchase, index) => (
                  <div
                    className='mt-4 grid grid-cols-12 items-center bg-white px-12 py-5 shadow last:mb-4'
                    key={purchase._id}
                  >
                    <div className='col-span-6'>
                      <div className='flex items-center'>
                        <div>
                          <input
                            checked={purchase.checked}
                            onChange={checkPurchase(index)}
                            type='checkbox'
                            className='h-5 w-5 rounded border accent-orange outline-none'
                          />
                        </div>
                        <div className='ml-4 flex-grow'>
                          <div className='flex'>
                            <Link
                              to={`${path.home}${generateNameId({
                                name: purchase.product.name,
                                id: purchase.product._id
                              })}`}
                              className='h-20 w-20 flex-shrink-0'
                            >
                              <img src={purchase.product.image} alt={purchase.product.name} />
                            </Link>
                            <Link
                              to={`${path.home}${generateNameId({
                                name: purchase.product.name,
                                id: purchase.product._id
                              })}`}
                              className='ml-4 line-clamp-2 flex-grow'
                            >
                              {purchase.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='col-span-6'>
                      <div className='grid grid-cols-5'>
                        <div className='col-span-2 flex items-center justify-center'>
                          <div className='flex items-center gap-2'>
                            <div className='max-w-[50%] truncate text-gray-500 line-through'>
                              <span>₫</span>
                              <span className='text-sm text-gray-500'>
                                {formatCurrency(purchase.product.price_before_discount)}
                              </span>
                            </div>

                            <div>
                              <span>₫</span>
                              <span className='text-sm'>{formatCurrency(purchase.product.price)}</span>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-1'>
                          <QuantityController
                            max={purchase.product.quantity}
                            value={purchase.buy_count}
                            classNameWrapper='m-0'
                            onDecrease={(value) => handleQuantity(index, value, value !== purchase.buy_count)}
                            onIncrease={(value) => handleQuantity(index, value, value < purchase.product.quantity)}
                            disabled={purchase.disabled}
                            onType={(value) => handleTypeQuantity(index, value)}
                            onFocusOut={(value) =>
                              handleQuantity(
                                index,
                                value,
                                value >= 1 &&
                                  value < purchase.product.quantity &&
                                  value !== (productInCartData as Purchases[])[index].buy_count
                              )
                            }
                          />
                        </div>
                        <div className='col-span-1 flex items-center justify-center text-orange'>
                          <span>₫</span>
                          <span className='text-sm'>{formatCurrency(purchase.product.price * purchase.buy_count)}</span>
                        </div>
                        <div className='col-span-1 flex items-center justify-center'>
                          <Button
                            className='border-none bg-transparent text-black outline-none hover:text-orange'
                            onClick={handleDeletePurchase(index)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='sticky bottom-0 left-0 z-10 mt-4 border border-t-gray-500/20 bg-white shadow-lg'>
              <div className='grid grid-cols-12 items-center gap-5 px-8 py-5'>
                <div className='col-span-12 xl:col-span-6'>
                  <div className='flex items-center'>
                    <div>
                      <input
                        checked={isCheckAllPurchase}
                        onChange={toggleCheckAllPurchase}
                        type='checkbox'
                        className='h-5 w-5 rounded border accent-orange outline-none'
                      />
                    </div>
                    <div className='ml-6 flex gap-8'>
                      <Button
                        onClick={toggleCheckAllPurchase}
                        className='border-none bg-transparent text-gray-700 outline-none'
                      >
                        Chọn tất cả ({extendsPurchases.length})
                      </Button>
                      <Button
                        className='border-none bg-transparent text-gray-700 outline-none'
                        onClick={handleDeleteManyPurchases}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>

                <div className='col-span-12 xl:col-span-6'>
                  <div className='flex items-center justify-between gap-6 sm:gap-2 xl:justify-end'>
                    <div>
                      <div className='flex items-center gap-1'>
                        <p className='text-[12px] sm:text-[16px]'>Tổng thanh toán ({checkedPurchasesCount}): </p>
                        <span className='text-lg text-orange md:text-2xl'>
                          ₫{formatCurrency(totalCheckedPurchasePrice)}
                        </span>
                      </div>
                      <div className='grid grid-cols-12 items-center'>
                        <span className='col-span-8 text-right text-[12px] sm:text-[16px] lg:col-span-10'>
                          Tiết kiệm
                        </span>
                        <span className='col-span-4 text-right text-orange lg:col-span-2'>
                          ₫{formatNumberToSocialStyle(totalCheckedPurchaseSavingPrice)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className='flex h-11 w-[100px] items-center justify-center rounded-sm bg-orange text-[12px] capitalize text-white sm:w-[150px] sm:text-[16px] md:w-[200px]'
                      disabled={buyProductMutation.isLoading}
                      onClick={handleBuyProduct}
                    >
                      Mua hàng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center gap-4 py-10'>
            <img src={noproduct} alt='no-product' className='h-28 w-28' />

            <div className='text-sm font-bold text-gray-400'>Giỏ hàng của bạn còn trống</div>

            <Button className='flex h-9 w-[100px] items-center justify-center rounded-sm bg-orange text-[12px] capitalize text-white sm:w-[150px] sm:text-[16px] md:w-[160px]'>
              <Link to={path.home} className='uppercase'>
                mua ngay
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className='container mt-4'>
        {productRelateList?.products?.length && (
          <>
            <div className='flex items-center justify-between'>
              <span className='uppercase text-gray-500'>có thể bạn cũng thích</span>

              <Link to={path.home} className='flex items-center gap-1 text-sm capitalize text-orange'>
                xem tất cả{' '}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-4 w-4 stroke-orange'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            </div>

            <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'>
              {productRelateList.products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
