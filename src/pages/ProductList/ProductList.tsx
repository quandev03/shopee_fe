import { useQuery } from '@tanstack/react-query';
import { categoryApi } from 'src/api/category.api';
import { productApi } from 'src/api/product.api';
import Pagination from 'src/components/Pagination';
import useQueryConfig from 'src/hooks/useQueryConfig';
import {Category, ProductListConfig, ProductResponse, ProductType} from 'src/@types/product.type';
import AsideFilter from './components/AsideFilter';
import Product from './components/Product';
import SortProduct from './components/SortProduct';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import {ProductResponseAPI} from "../../@types/product-res.type.ts";
import {CategoryType} from "../../@types/category.type.ts";

type Pagination = {
  page: number,
  limit: number,
  page_size: number
}
export default function ProductList() {
  const queryConfig = useQueryConfig();
  console.log("Trang chủ")
  const { data: productsData, isLoading, isError } = useQuery(
      ['productList', queryConfig],  // queryKey bao gồm cả 'productList' và queryConfig
      async (): Promise<any> => {
        return productApi.getProductList(queryConfig as ProductListConfig);  // Gọi API với queryConfig đã được xác định
      },
      {
        keepPreviousData: true,  // Giữ dữ liệu cũ khi thay đổi queryConfig
        refetchOnWindowFocus: false,  // Nếu cần, có thể tắt refetch khi focus lại cửa sổ
        staleTime: 1000 * 60 * 5,  // Tùy chọn: Đặt thời gian stale (ví dụ 5 phút)
        retry: 1  // Tùy chọn: Thử lại 1 lần nếu có lỗi
      }
  );

  console.log(productsData)
  let responseData: ProductResponseAPI | undefined = productsData?.data;
  console.log(responseData)

  let dataProduct = productsData?.data?.content;

  let pagination:Pagination = {
    page: productsData?.data?.pageable?.pageNumber,
    limit: productsData?.data?.pageable?.pageSize,
    page_size : Math.ceil(productsData?.data?.pageable?.pageSize / productsData?.data?.pageable?.pageNumber+1)
  }
  let test_data =  responseData?.content.map((productsData) => {
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


  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getAll();
    }
  });
  console.log(categoriesData)
  let dataCategory: CategoryType[] | [] = categoriesData?.data?.map((category:any) => {
    return {
      _id: category?.id,
      name: category?.name
    }
  })
  console.log(dataCategory);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productsData])

  return (
    <div className='bg-gray-100 py-3'>
      <Helmet>
        <title>Shopee Clone | Ho Hoang Sang</title>
        <meta name='descroption' content='Đây là dự án cá nhân và thực hiện không vì mục đích thương mại' />
      </Helmet>

      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-2'>
              <AsideFilter queryConfig={queryConfig} categories={dataCategory || []} />
            </div>

            <div className='col-span-10'>
              {/*<SortProduct pageSize={pagination.page_size} queryConfig={queryConfig} />*/}
              <div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {test_data && test_data.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
              <Pagination queryConfig={queryConfig} page={pagination.page} limit={pagination.limit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
