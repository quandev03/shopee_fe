import { useQuery } from '@tanstack/react-query';
import { categoryApi } from 'src/api/category.api';
import { productApi } from 'src/api/product.api';
import Pagination from 'src/components/Pagination';
import useQueryConfig from 'src/hooks/useQueryConfig';
import {Category, ProductListConfig, ProductResponse, ProductType} from 'src/@types/product.type';
import AsideFilter from './components/AsideFilter';
import Product from './components/Product';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {ProductResponseAPI} from "../../@types/product-res.type.ts";
import {CategoryType} from "../../@types/category.type.ts";

export default function ProductList() {
  const queryConfig = useQueryConfig();

  const navigate = useNavigate();
  console.log("Trang chủ")
  const { data: productsData, isLoading, isError } = useQuery(
    ['productList', JSON.stringify(queryConfig)],

    async (): Promise<any> => {
      return productApi.getProductList({
        page: Number(queryConfig.page) || 0,
        limit: Number(queryConfig.limit) || 12,
        priceMin: queryConfig.priceMin !== 'null' ? Number(queryConfig.priceMin) : undefined,
        priceMax: queryConfig.priceMax !== 'null' ? Number(queryConfig.priceMax) : undefined,
        category: queryConfig.category !== 'null' ? queryConfig.category : undefined,
        rating: Number(queryConfig.rating) || null,
        name: queryConfig.name !== 'null' ? queryConfig.name : undefined,
        sort: queryConfig.sort_by !== 'null' ? queryConfig.sort_by : undefined
      });
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1
    }
  );

  console.log(productsData)
  let responseData: ProductResponseAPI | undefined = productsData?.data;
  let paginatedProducts = responseData?.content?.map((item) => {
    return {
      _id: item.id,
      name: item.nameProduct,
      description: item.description || '',
      price: item.price,
      quantity: item.quantity,
      sold: item.soldQuantity,
      view: item.viewedQuantity,
      image: item.image || '',
      category: item.category ? {
        _id: item.category.id,
        name: item.category.name
      } : null,
      rating: item.rating || 0,
      price_before_discount: item.price,
      images: [],
      createdAt: item.createDate || '',
      updatedAt: ''
    };
  }) || [];
  const totalPages = responseData?.totalPages || 1;

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
              <div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <Product key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 text-lg py-10">
                    Không tìm thấy sản phẩm phù hợp với bộ lọc.
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-center items-center gap-1">
                <button
                  onClick={() => {
                    if (Number(queryConfig.page) > 1) {
                      navigate({
                        search: new URLSearchParams({
                          ...queryConfig,
                          page: String(Number(queryConfig.page) - 1)
                        }).toString()
                      });
                    }
                  }}
                  disabled={Number(queryConfig.page) <= 1}
                  className="px-2 py-1 text-xl text-gray-400 disabled:opacity-30"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      navigate({
                        search: new URLSearchParams({
                          ...queryConfig,
                          page: page.toString()
                        }).toString()
                      });
                    }}
                    className={`w-9 h-9 rounded border text-sm font-medium ${
                      Number(queryConfig.page) === page
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'border-gray-300 text-black hover:border-orange-500 hover:text-orange-500'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => {
                    if (Number(queryConfig.page) < totalPages) {
                      navigate({
                        search: new URLSearchParams({
                          ...queryConfig,
                          page: String(Number(queryConfig.page) + 1)
                        }).toString()
                      });
                    }
                  }}
                  disabled={Number(queryConfig.page) >= totalPages}
                  className="px-2 py-1 text-xl text-gray-400 disabled:opacity-30"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
