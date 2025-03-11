import { useQuery } from '@tanstack/react-query';
import { productApi } from 'src/api/product.api';
import { categoryApi } from 'src/api/category.api';
import { ProductListConfig, ProductType } from 'src/@types/product.type';
import Pagination from 'src/components/Pagination';
import SortProduct from './components/SortProduct';
import AsideFilter from './components/AsideFilter';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Product from './components/Product';
import useQueryConfig from '../../hooks/useQueryConfig';
import { log } from 'console';

export default function ProductList() {
  const queryConfig = useQueryConfig();

  // Query API lấy danh sách sản phẩm
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['productList', queryConfig],
    queryFn: () => productApi.getProductList(queryConfig as ProductListConfig),
    keepPreviousData: true
  });
  

  // Query API lấy danh sách danh mục
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll()
  });

  useEffect(() => {
    if (productsData) {
      window.scrollTo(0, 0); // Cuộn lên đầu trang khi productsData thay đổi
    }
  }, [productsData]);

  if (productsLoading || categoriesLoading) {
    return <div>Loading...</div>;
  }

  console.log(productsData?.data.content)

  // Truy cập vào response.data để lấy các thuộc tính như pagination
  const products = productsData?.data.content.map((product) => ({
    id: product.id,
    name: product.nameProduct || "No name",
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    soldQuantity: product.soldQuantity,
    viewedQuantity: product.viewedQuantity,
    images: product.images != null ? product.images : [],
    image: product.image? product.image : '',
    category: product.category ? {
      _id: product.category._id,
      name: product.category.name
    } : undefined
  }));
  console.log(products);

  return (
      <div className="bg-gray-100 py-3">
        <Helmet>
          <title>Shopee Clone | Ho Hoang Sang</title>
          <meta name="description" content="Đây là dự án cá nhân và thực hiện không vì mục đích thương mại" />
        </Helmet>

        <div className="container">
          {productsData && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-2">
                  <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
                </div>

                <div className="col-span-10">
                  {queryConfig && (
                    <>
                      {/* <SortProduct pageSize={productsData?.data?.pagination?.page_size} queryConfig={queryConfig} /> */}
                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {products?.map((product) => (
                            <Product 
                              key={product.id} 
                              product={{
                                ...product,
                                priceBeforeDiscount: product.price,
                                soldQuantity: product.soldQuantity,
                                rating: 5
                              }}
                            />
                        ))}
                      </div>
                      {/* <Pagination queryConfig={queryConfig} pageSize={productsData?.data?.pagination?.page_size} /> */}
                    </>
                  )}
                </div>
              </div>
          )}
        </div>
      </div>
  );
}