import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from 'src/api/product.api';
import { purchasesApi } from 'src/api/purchases.api';
import ToastSuccess from 'src/components/CustomToast/ToastSuccess';
import ProductRating from 'src/components/ProductRating';
import QuantityController from 'src/components/QuantityController';
import { path } from 'src/constants/path';
import { purchasesStatus } from 'src/constants/purchases';
import { ProductListConfig, ProductType as ProductType } from 'src/@types/product.type';
import { ProductCart } from 'src/@types/purchases.type';
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, saleRate } from 'src/utils/utils';
import Product from '../ProductList/components/Product';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { convert } from 'html-to-text';
import {ProductResponseAPI} from "../../@types/product-res.type.ts";
interface ProductResponse {
  id: string;
  nameProduct: string;
  description: string;
  price: number;
  quantity: number;
  soldQuantity: number;
  viewedQuantity: number;
  images: string[]; // Array of image URLs
  image: string; // Single image URL
  category: {
    name: string;
    id: string;
  };
  createDate: string; // Assuming createDate can be null
  rating: number;
}


export default function ProductDetail() {
  const { t } = useTranslation('product');
  const { nameId } = useParams();
  const navigate = useNavigate();
  const id = getIdFromNameId(nameId as string);
  const queryClient = useQueryClient();
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: ():Promise<any> => {
      return productApi.getProduct(id as string);
    }
  });
  let responseData :ProductResponse =  productDetailData?.data;
  console.log(responseData)

  let productDetail: ProductType = {
    _id: responseData?.id ,
    images:responseData?.images,
    price: responseData?.price,
    rating: responseData?.rating,
    price_before_discount: responseData?.price,
    quantity: responseData?.quantity,
    sold: responseData?.soldQuantity,
    view: responseData?.viewedQuantity,
    description: responseData?.description,
    name: responseData?.nameProduct,
    category: {
      _id: responseData?.category != null  ?responseData?.category.id : "",
      name: responseData?.category != null ? responseData?.category.name : "Không Xác Định"
    },
    image: responseData?.image,
    createdAt: responseData?.createDate ? responseData?.createDate : "",
    updatedAt: ""
  }
  console.log(responseData)

  const [role, setRole] = useState<number>(0);
  let cfm, btn = "";

  const [showToastSuccess, setShowToastSuccess] = useState(false);

  const [buyCount, setBuyCount] = useState(1);
  const [thisImage, setThisImage] = useState(0)

  const product = productDetail;

  const queryConfig: ProductListConfig = { page: '1', limit: '20', category: product?.category._id };

  const { data: productList } = useQuery({
    queryKey: ['productListCategory', queryConfig],
    queryFn: () => {
      return productApi.getProductList(queryConfig);
    },
    enabled: Boolean(product)
  });

  let responseDataList: ProductResponseAPI | any = productList?.data;
  let test_data =  responseDataList?.content.map((productsData:any) => {
    return {
      _id: productsData.id,
      name: productsData.nameProduct,
      description: productsData.description,
      price: productsData.price,
      quantity: productsData.quantity,
      sold: productsData.soldQuantity,
      view: productsData.viewedQuantity,
      image: productsData.image ?? '',  // Handle null values
      category: {
        _id: productsData.category?.id, // Handle optional category
        name: productsData.category?.name
      },
      rating: 0,
      price_before_discount : productsData.price,
      images: [], // Default to an empty array if images are missing
      createdAt: "",
      updatedAt: ""
    };
  });



  console.log(test_data)
  const imageRef = useRef<HTMLImageElement>(null);

  const [currentImagesIndex, setCurrentImageIndex] = useState([0, 5]);

  const [imageActived, setImageActived] = useState('');

  const currentImagesList = productDetail?.images

  if (role == 0){
    cfm = "mua ngay";
    btn = "thêm vào giỏ hàng";
  }
  else {
    cfm = "lưu";
    btn = "sửa";
  }

  const addToCartMutation = useMutation({
    mutationFn: (body: ProductCart) => {
      return purchasesApi.addToCart(body);
    }
  });

  useEffect(() => {
    if (product && product?.images?.length) {
      setImageActived(product.images[0]);
    }
  }, [product]);

  const activeImage = (img: string) => {
    setImageActived(img);
  };

  const prevSlice = () => {
    console.log("before")
    // if (currentImagesIndex[0] <= 0) return;
    if (thisImage == 0) return;

    // setCurrentImageIndex((prev) => [prev[0] - 1, prev[1] - 1]);
    setThisImage(thisImage-1)
    console.log(thisImage)
  };

  const nextSlice = () => {
    console.log("next")
    // if (currentImagesIndex[1] >= (product as ProductType)?.images.length) return;
    //
    // setCurrentImageIndex((prev) => [prev[0] + 1, prev[1] + 1]);
    // console.log(currentImagesIndex)

    // if (currentImagesIndex[0] <= 0) return;
    if (thisImage == productDetail.images.length) return;

    // setCurrentImageIndex((prev) => [prev[0] - 1, prev[1] - 1]);
    setThisImage(thisImage+1)
    console.log(thisImage)
  };

  const handleImageZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const image = imageRef.current as HTMLImageElement;
    const { naturalWidth, naturalHeight } = image;

    //Cách 1: Lấy offsetX và offsetY đơn giản trong trường hợp xử lý được bubble event
    // const { offsetX, offsetY } = event.nativeEvent;

    //Cách 2: Tính toán offsetX và offsetY trong trường hợp không xử lý được bubble event đối với element con, ví dụ trường hợp element con là một component được import bên ngoài vào element cha

    const offsetX = event.pageX - (rect.x + window.scrollX);
    const offsetY = event.pageY - (rect.y + window.scrollY);

    const top = offsetY * (1 - naturalHeight / rect.height);
    const left = offsetX * (1 - naturalWidth / rect.width);

    image.style.width = naturalWidth + 'px';
    image.style.height = naturalHeight + 'px';
    image.style.maxWidth = 'unset';
    image.style.top = top + 'px';
    image.style.left = left + 'px';
  };

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style');
  };

  // todo: thay đổi số lượng mua
  const handleChangeQuantity = (value: number) => {
    setBuyCount(value);
  };

  // todo thêm vào giỏ hàng
  const handleAddToCart = (body: ProductCart) => {
    addToCartMutation.mutate(body, {
      onSuccess: () => {
        // toast.success('Thêm vào giỏ hàng thành công', { autoClose: 1000 });
        // customToast.renderToastSuccess({ duration: 1000 });
        setShowToastSuccess(true);
        queryClient.invalidateQueries({ queryKey: ['purchasesCart', { status: purchasesStatus.inCart }] });
      }
    });
  };
// Todo: nút mua ngay
  const buyNow = async (body: ProductCart) => {
    const res = await addToCartMutation.mutateAsync(body);
    const purchase = res.data.data;

    navigate(path.cart);
  };

  if (!product) return null;

  return (
    // Todo: giao diện chi tiết sản phẩm
    <div className='relative bg-gray-100 py-3'>
      <Helmet>
        <title>{product.name}</title>
        <meta
          name='description'
          content={convert(product.description || '', {
            limits: {
              maxInputLength: 200
            }
          })}
        />
      </Helmet>

      <div className='container bg-white shadow'>
        <div className='grid grid-cols-12 gap-9'>
          <div className='col-span-5'>
            <div
              className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
              onMouseMove={handleImageZoom}
              onMouseLeave={handleRemoveZoom}
            >
              <img
                src={productDetail?.images?.length>0?productDetail?.images[thisImage]:"Khong"}
                alt={product.name}
                className='absolute left-0 top-0 h-full w-full  bg-white object-cover'
                ref={imageRef}
              />
            </div>

            <div className='relative mt-4 grid w-full grid-cols-5 gap-5'>
              <button
                onClick={prevSlice}
                className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-gray-200/60 font-semibold text-white'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='{1.5}'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </button>

              {currentImagesList?.slice(currentImagesIndex[0], currentImagesIndex[1]).map((image) => {
                const isActive = image === imageActived;

                return (
                  <div
                    className='relative w-full cursor-pointer pt-[100%]'
                    key={image}
                    onMouseEnter={() => activeImage(image)}
                  >
                    <img src={image} alt={image} className='absolute left-0 top-0 w-full object-contain' />
                    {isActive && (
                      <div className='absolute left-0 top-0 h-full w-full border border-orange bg-transparent' />
                    )}
                  </div>
                );
              })}

              <button
                onClick={nextSlice}
                className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-gray-200/60 font-semibold text-white'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='{1.5}'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </button>
            </div>
          </div>

          <div className='col-span-7'>
            <h1 className='text-xl font-medium uppercase'>
              {
                role === 1?(
                  <input type="text" placeholder={product.name} style={{width: '600px', border: '1px solid '}}/>
                )
                : role === 0?(
                  <span className='text-xl font-medium uppercase'>{product.name}</span>
                ) : product.name
              }
            </h1>
            <div className='my-4 flex items-center'>
              <div className='flex items-center gap-1'>
                <span className='mt-1 text-orange underline'>{product.rating}</span>
                <ProductRating
                  rating={product.rating}
                  classNameStartFilled='h-4 w-4 fill-orange text-orange'
                  classNameNonStartFilled='h-4 w-4 fill-current text-gray-300'
                />
              </div>

              <div className='mx-4 h-6 w-[1px] bg-gray-300' />

              <div>
                <span>{formatNumberToSocialStyle(product.sold)}</span>
                <span className='ml-1 text-sm capitalize text-gray-500'>{t('sold')}</span>
              </div>
            </div>

            <div className='flex items-center bg-gray-100 px-6 py-4'>
              <span className='text-gray-500 line-through'>₫{
              //formatCurrency(product.price_before_discount)


                  <span className='text-xl font-medium uppercase'>{product.price_before_discount}</span>

              }</span>

              <div className='ml-3 text-3xl text-orange'>₫{
              //formatCurrency(product.price)
              role === 1?(
                <input type="text" placeholder={formatCurrency(product.price)} style={{width: '200px', border: '1px solid '}}/>
              )
              : role === 0?(
                <span className='text-xl font-medium uppercase'>{product.price}</span>
              ) : product.price
              }</div>

              <div className='ml-5 rounded-sm bg-orange px-1 text-sm font-semibold uppercase text-white'>
                <span>{saleRate(product.price_before_discount, product.price)} </span>
                {t('off')}
              </div>
            </div>

            <div className='mt-6 flex items-center'>
              <span className='capitalize text-gray-500'>{t('quantity')}</span>

              <QuantityController
                onDecrease={handleChangeQuantity}
                onIncrease={handleChangeQuantity}
                onType={handleChangeQuantity}
                value={buyCount}
                max={product.quantity}
              />

              <span className='ml-5 text-gray-500'>
                {
                //product.quantity
                role === 1?(
                  <input type="text" placeholder={formatCurrency(product.quantity)} style={{width: '100px', border: '1px solid '}}/>
                )
                : role === 0?(
                  <span className='text-xl font-medium uppercase'>{product.quantity}</span>
                ) : product.quantity
                } {t('pieces available')}
              </span>
            </div>

            <div className='mt-6 flex items-center gap-4'>
              <button
                onClick={() => {
                  if (role == 0){
                    handleAddToCart({ product_id: id, buy_count: buyCount });
                  }
                }}
                className='flex-items-center flex gap-2 rounded-sm border border-orange bg-orange/10 px-5 py-3 capitalize text-orange hover:bg-orange/20'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='{1.5}'
                  stroke='currentColor'
                  className='h-5 w-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>
                {btn}
              </button>
{/* nut mua ngay */}
              <button
                onClick={() => {
                  if (role == 0){
                    buyNow({ product_id: id, buy_count: buyCount });
                  }
                }}
                className='rounded-sm bg-orange px-5 py-3 capitalize text-white hover:bg-orange/80'
              >
                {cfm}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='container mt-4 bg-white'>
        <div className='bg-gray-100/40 p-3 text-lg uppercase'>{t('product description')}</div>

        <div className='p-3 text-sm leading-loose'>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description as string) }} />
        </div>
      </div>
      <div className='container mt-4'>
        {test_data && (
          <div>
            <div className='uppercase text-gray-500'>{t('you may also like')}</div>
            <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'>
              {test_data?.map((product:ProductType) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ToastSuccess
        setShow={setShowToastSuccess}
        show={showToastSuccess}
        message='Sản phẩm đã được thêm vào Giỏ hàng'
        duration={1500}
      />
    </div>
  );
}
