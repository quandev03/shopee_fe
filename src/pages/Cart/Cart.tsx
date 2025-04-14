import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import keyBy from 'lodash/keyBy';
import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import {AddressApi} from "../../api/address.api.ts";
import product from "../ProductList/components/Product";
import {
  Table,
  Input,
  Select,
  Space,
  message,
  Button as AntdButton
} from 'antd';

const { Title } = Typography;
const { Option } = Select;

const randomPage = randomInteger(1, 3).toString();

type VoucherDTO = {
  code:string,
  id: string,
  discount: number,
  name: string
}

export default function Cart() {
  const { extendsPurchases, setExtendsPurchases } = useContext(AppContext);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [openManageAddressDialog, setOpenManageAddressDialog] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: '',
    city: '',
    district: '',
    commune: '',
    specific: '',
    phone: '',
    provincial: '',
    default: false,
    id: ''
  });
  const [district, setDistrict] = useState([])
  const [comute, setComute] = useState([])
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    provincial: '',
    district: '',
    commune: '',
    specific: ''
  });
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [openVoucherDialog, setOpenVoucherDialog] = useState(false);
  const handleOpenVoucherDialog = () => {
    getListVoucher.mutate()
    setOpenVoucherDialog(true)
  };
  const handleCloseVoucherDialog = () => setOpenVoucherDialog(false);

  const status = purchasesStatus.inCart;
  const queryClient = useQueryClient();
  const location = useLocation();
  const purchaseChosenFromProductDetail = (location.state as { purchaseId: string } | null)?.purchaseId;
  const queryConfig: ProductListConfig = { page: randomPage, limit: '12' };

  const { data: purchasesData, refetch } = useQuery({
    queryKey: ['purchasesCart', { status }],
    queryFn: () => purchasesApi.getPurchases()
  });

  const { data: voucherFetch } = useQuery({
    queryKey: ['voucherFetch', { status }],
    queryFn: () => purchasesApi.getListVoucher()
  });
  console.log(voucherFetch)
  useEffect(()=>{
    setVouchers(voucherFetch?.data?.map(v=>({
      id: v.id,
      code: v.voucherCode,
      description: v.description,
      discount: v.discount
    })))
  }, [])
  let listCart : CartResponse = purchasesData?.data;
  const getListVoucher = useMutation({
    mutationFn:()=> purchasesApi.getListVoucher(),
    onSuccess: (res) =>{
      console.log(res)
    }
  })

  console.log(vouchers)
  const { data: addressProvincial } = useQuery({
    queryKey: ['addressProvincial'],
    queryFn: () => AddressApi.getListProvince()
  });
  let listProvincial = addressProvincial?.data;
  console.log(listProvincial)
  const { data: productRelateData } = useQuery({
    queryKey: ['productRelate', queryConfig],
    queryFn: () => productApi.getProductList(queryConfig)
  });

  const {data: dataAddressResponse, isLoading, error} = useQuery({
    queryKey: ['dataAddressResponse', queryConfig],
    queryFn:()=> AddressApi.getUserAddress()
  })
  let dataAddress = dataAddressResponse?.data
  console.log(dataAddressResponse?.data)
  console.log(dataAddress)
  let defaultAddress  = dataAddress?.filter(address=>address?.default==true)
  if (Array.isArray(defaultAddress) && defaultAddress.length !== 0) {
    defaultAddress = dataAddress[0]; // Set the first address if defaultAddress is not empty
  }
  console.log(defaultAddress)
  useEffect(() => {
    // Step 2: Once the data is fetched, process it
    if (!isLoading && !error && dataAddressResponse?.data) {
      let dataAddress = dataAddressResponse.data;
      console.log(dataAddress);

      // Step 3: Find the default address, or set the first address if none is default
      let defaultAddress = dataAddress?.find(address => address?.default === true);

      if (!defaultAddress) {
        defaultAddress = dataAddress[0]; // Fallback to the first address if no default
      }

      console.log(defaultAddress);

      // Step 4: Set the selected address state
      if(defaultAddress != undefined) {
        console.log("pass")
        setSelectedAddress({
          name: defaultAddress?.name || "",
          city: "",
          district: defaultAddress?.district || "",
          commune: defaultAddress?.commune || "",
          specific: defaultAddress?.detail || "",
          phone: defaultAddress?.phone || "",
          provincial: defaultAddress?.province || "",
          default: defaultAddress?.default || false,
          id: defaultAddress?.id || "",
        });
      }
    }
  }, [dataAddressResponse, isLoading, error]);

  const productRelateList = productRelateData?.data.data;

  const updatePurchaseMutation = useMutation({
    mutationFn: (body: ProductCart) => purchasesApi.updatePurchases(body),
    onSuccess: () => refetch()
  });

  const deletePurchaseMutation = useMutation({
    mutationFn: (cartId: string) => purchasesApi.deletePurchases(cartId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['purchasesCart', { status }] })
  });

  const getListNextAddress = useMutation({
    mutationFn: (beforeAddress: string) => AddressApi.getNextAddressLevel(beforeAddress),
    onSuccess: (response) => {
      console.log(response); // Xử lý dữ liệu trả về từ API
      setDistrict(response.data)
    },
    onError: (error) => {
      console.error('Có lỗi xảy ra:', error); // Xử lý lỗi nếu có
    },
  });
  const getListNextAddressCom = useMutation({
    mutationFn: (beforeAddress: string) => AddressApi.getNextAddressLevel(beforeAddress),
    onSuccess: (response) => {
      console.log(response); // Xử lý dữ liệu trả về từ API
      setComute(response.data)
    },
    onError: (error) => {
      console.error('Có lỗi xảy ra:', error); // Xử lý lỗi nếu có
    },
  });

  const addNewAddressUser = useMutation({
    mutationFn:(body:AddressUserRequest)=> AddressApi.addNewAddressUser(body),
    onSuccess: () => {
      console.log("Success");
      queryClient.invalidateQueries({ queryKey: ['dataAddressResponse', queryConfig] })
    }
  })

  const deleteAddressUser = useMutation({
    mutationFn:(addressId: string)=> AddressApi.deleteAddressUser(addressId),
    onSuccess:()=>{
      console.log("Success")
      toast.success("Delete my address success")
    }
  })

  const updateAddressUser = useMutation({
    mutationFn:(data: {body: AddressUserRequest, addressId: string}) => AddressApi.updateAddressUser(data.addressId ,data.body),
    onSuccess:()=>{
      console.log("Success")
      toast.success("Update my address success")
    }
  })

  const buyProductMutation = useMutation({
    mutationFn: (param: {cartId: string, addressUserId: string , voucherCode: string}) => purchasesApi.buyProducts(param),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchasesCart', { status }] });
      toast.success("Đặt hàng thành công", { position: 'top-center' });
    }
  });

  const handleClickOpenAddressDialog = () => {
    console.log(newAddress)
    resetNewAddress();
    setOpenAddressDialog(true);
  };

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
    resetNewAddress();
  };

  const handleOpenManageAddressDialog = () => setOpenManageAddressDialog(true);
  const handleCloseManageAddressDialog = () => setOpenManageAddressDialog(false);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if(field==="provincial") {
      getListNextAddress.mutate( event.target.value)
    }else if (field==="district") {
      getListNextAddressCom.mutate(event.target.value)
    }
    console.log(field)
    setNewAddress((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      provincial: '',
      district: '',
      commune: '',
      specific: ''
    };

    if (!newAddress.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
      isValid = false;
    } else if (newAddress.name.trim().length < 2) {
      newErrors.name = 'Họ và tên phải có ít nhất 2 ký tự';
      isValid = false;
    }

    if (!newAddress.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!/^(0[35789])[0-9]{8}$/.test(newAddress.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';
      isValid = false;
    }
    if (newAddress.specific.trim() && newAddress.specific.trim().length < 5) {
      newErrors.specific = 'Địa chỉ cụ thể phải có ít nhất 5 ký tự';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetNewAddress = () => {
    setNewAddress({
      name: '',
      city: '',
      district: '',
      commune: '',
      specific: '',
      phone: '',
      provincial: '',
      default: false,
      id: ''
    });
    setErrors({
      name: '',
      phone: '',
      provincial: '',
      district: '',
      commune: '',
      specific: ''
    });
  };

  const handleSubmitAddress = () => {
    if (validate()) {
      const addressWithId = { ...newAddress, id: Date.now().toString() };

      console.log(newAddress)

      let dataAdd: AddressUserRequest = {
        provincialAddress: newAddress.provincial,
        districtId: newAddress.district,
        commercalAddress: newAddress.commune,
        detailAddress: newAddress.specific,
        isDefault: newAddress.default,
        phone: newAddress.phone,
        fullName: newAddress.name
      }
      addNewAddressUser.mutate(dataAdd)
      setAddresses((prev) => {
        if (addressWithId.default) {
          return [...prev.map((addr) => ({ ...addr, default: false })), addressWithId];
        }
        return [...prev, addressWithId];
      });
      if (addressWithId.default || addresses.length === 0) setSelectedAddress(addressWithId);
      toast.success('Thêm địa chỉ thành công!');
      handleCloseAddressDialog();
    }
  };

  const handleEditAddress = (address) => {
    setNewAddress(address);
    setOpenAddressDialog(true);
  };

  const handleUpdateAddress = () => {

    let dataAdd: AddressUserRequest = {
      provincialAddress: newAddress.provincial,
      districtId: newAddress.district,
      commercalAddress: newAddress.commune,
      detailAddress: newAddress.specific,
      isDefault: newAddress.default,
      phone: newAddress.phone,
      fullName: newAddress.name
    }

    console.log(newAddress)
    let data: {body: AddressUserRequest, addressId: string}= {
       body:dataAdd,
      addressId: newAddress.id
    }
    updateAddressUser.mutate(data)

    if (validate()) {
      setAddresses((prev) => {
        if (newAddress.default) {
          return prev.map((addr) =>
              addr.id === newAddress.id ? newAddress : { ...addr, default: false }
          );
        }
        return prev.map((addr) => (addr.id === newAddress.id ? newAddress : addr));
      });
      if (newAddress.default || selectedAddress?.id === newAddress.id) setSelectedAddress(newAddress);
      toast.success('Cập nhật địa chỉ thành công!');
      handleCloseAddressDialog();
    }
  };

  const handleDeleteAddress = (id) => {
    deleteAddressUser.mutate(id)
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    if (selectedAddress?.id === id) {
      const newDefault = addresses.find((addr) => addr.default && addr.id !== id) || addresses[0] || null;
      setSelectedAddress(newDefault);
    }
    toast.success('Xóa địa chỉ thành công!');
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    handleCloseManageAddressDialog();
  };

  const productInCartData = purchasesData?.data;
  const isCheckAllPurchase = useMemo(() => extendsPurchases.every((purchase) => purchase?.checked), [extendsPurchases]);
  const checkedPurchases = useMemo(() => extendsPurchases.filter((purchase) => purchase?.checked), [extendsPurchases]);
  const checkedPurchasesCount = checkedPurchases.length;

  const totalCheckedPurchasePrice = useMemo(
      () => checkedPurchases.reduce((total, purchase) => total + purchase?.quantity * purchase.product.price, 0),
      [checkedPurchases]
  );

  const totalCheckedPurchaseSavingPrice = useMemo(
      () =>
          checkedPurchases.reduce(
              (total, purchase) =>
                  total + (purchase.product.price - purchase.product.price) * purchase?.quantity,
              0
          ),
      [checkedPurchases]
  );

  useEffect(() => {
    setExtendsPurchases((prev) => {
      const purchasesObject = keyBy(prev, '_id');
      return (
          listCart?.map((purchase:CartItem) => {
            const isChosenPurchase = purchaseChosenFromProductDetail === purchase.id;
            return {
              ...purchase,
              checked: isChosenPurchase || Boolean(purchasesObject[purchase.id]?.checked),
              disabled: false
            };
          }) || []
      );
    });
  }, [productInCartData, purchaseChosenFromProductDetail, setExtendsPurchases]);
useEffect(()=>{
  console.log(district)
  console.log(comute)
}, [district, comute])
  useEffect(() => {
    return () => {
      history.replaceState(null, '');
    };
  }, []);

  const toggleCheckAllPurchase = () => {
    setExtendsPurchases(produce((draft) => draft.map((purchase) => ({ ...purchase, checked: !isCheckAllPurchase }))));
  };

  const checkPurchase = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendsPurchases(
        produce((draft) => {
          draft[index].checked = event.target.checked;
        })
    );
  };

  const handleQuantity = (productIndex: string, value: number, enable: boolean) => {
    if (!enable) return;
    updatePurchaseMutation.mutate({ buy_count: value, product_id: productIndex});
  };

  const handleTypeQuantity = (productIndex: number, value: number) => {
    setExtendsPurchases(produce((draft) => { draft[productIndex].buy_count = value; }));
  };
  const handleDeletePurchase = (cartId:string) => () => {
    console.log(cartId)
    deletePurchaseMutation.mutate(cartId);
  };

  const handleDeleteManyPurchases = () => {
    const ids = checkedPurchases.map((purchase) => purchase?.id);
    ids.forEach((id:string) => {
    deletePurchaseMutation.mutate(id);
    })
  };

  const handleBuyProduct = () => {
    const listProduct:  {cartId: string, addressUserId: string, voucherCode: string}[] = checkedPurchases.map((purchase) => ({
      addressUserId: selectedAddress?.id,
      cartId: purchase?.id,
      voucherCode: selectedVoucher != null ? selectedVoucher.code : null
    }));
    console.log(listProduct)
    listProduct.forEach((param:{cartId: string, addressUserId: string, voucherCode: string}) => {
      console.log(param)
      buyProductMutation.mutate(param);
    })
  };

  const handleApplyVoucher = () => {
    if (voucherCode) {
      const voucher = vouchers.find(v => v.code === voucherCode);
      if (voucher) {
        setSelectedVoucher(voucher);
        message.success('Áp dụng voucher thành công!');
      } else {
        message.error('Mã voucher không hợp lệ!');
      }
    } else if (selectedVoucher) {
      message.success('Voucher đã được chọn!');
    } else {
      message.error('Vui lòng chọn hoặc nhập mã voucher!');
    }
  };

  // @ts-ignore
  return (
      <div className="bg-neutral-100">
        <Helmet>
          <title>Giỏ hàng</title>
          <meta name="description" content="Giỏ hàng của bạn" />
        </Helmet>
        <div className="container">
          {productInCartData?.length ? (
              <>
                <div className="overflow-auto text-sm">
                  <div className="min-w-[1200px]">
                    <div className="grid grid-cols-12 bg-white px-12 py-5 shadow">
                      <div className="col-span-6">
                        <div className="flex items-center">
                          <input
                              checked={isCheckAllPurchase}
                              onChange={toggleCheckAllPurchase}
                              type="checkbox"
                              className="h-5 w-5 rounded border accent-orange outline-none"
                          />
                          <div className="ml-4 capitalize">sản phẩm</div>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="grid grid-cols-5 items-center text-gray-500">
                          <div className="col-span-2 text-center capitalize">Đơn giá</div>
                          <div className="col-span-1 text-center capitalize">số lượng</div>
                          <div className="col-span-1 text-center capitalize">số tiền</div>
                          <div className="col-span-1 text-center capitalize">thao tác</div>
                        </div>
                      </div>
                    </div>
                    {productInCartData?.map((purchase, index) => (
                        <div
                            className="mt-4 grid grid-cols-12 items-center bg-white px-12 py-5 shadow last:mb-4"
                            key={purchase.id}
                        >
                          <div className="col-span-6">
                            <div className="flex items-center">
                              <input
                                  checked={purchase.checked}
                                  onChange={checkPurchase(index)}
                                  type="checkbox"
                                  className="h-5 w-5 rounded border accent-orange outline-none"
                              />
                              <div className="ml-4 flex-grow">
                                <div className="flex">
                                  <Link
                                      to={`${path.home}${generateNameId({ name: purchase.product.nameProduct, id: purchase.product.id })}`}
                                      className="h-20 w-20 flex-shrink-0"
                                  >
                                    <img src={purchase.product.image} alt={purchase.product.nameProduct} />
                                  </Link>
                                  <Link
                                      to={`${path.home}${generateNameId({ name: purchase.product.nameProduct, id: purchase.product.id })}`}
                                      className="ml-4 line-clamp-2 flex-grow"
                                  >
                                    {purchase.product.nameProduct}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-6">
                            <div className="grid grid-cols-5">
                              <div className="col-span-2 flex items-center justify-center">
                                <div className="flex items-center gap-2">
                                  <div className="max-w-[50%] truncate text-gray-500 line-through">
                                    <span>₫</span>
                                    <span className="text-sm text-gray-500">{formatCurrency(purchase.product.price)}</span>
                                  </div>
                                  <div>
                                    <span>₫</span>
                                    <span className="text-sm">{formatCurrency(purchase.product.price)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-1">
                                <QuantityController
                                    max={purchase?.product.quantity}
                                    value={purchase.quantity}
                                    classNameWrapper="m-0"
                                    onDecrease={(value) => handleQuantity(purchase?.id, value, value !== purchase.quantity)}
                                    onIncrease={(value) => handleQuantity(purchase?.id, value, value < 100)}
                                    disabled={false}
                                    onType={(value) => handleTypeQuantity(index, value)}
                                    onFocusOut={(value) =>
                                        handleQuantity(
                                            purchase?.id,
                                            value,
                                            value >= 1 && value < 1000 && value !== purchase?.product.quantity
                                        )
                                    }
                                />
                              </div>
                              <div className="col-span-1 flex items-center justify-center text-orange">
                                <span>₫</span>
                                <span className="text-sm">{formatCurrency(purchase.product.price * purchase.quantity)}</span>
                              </div>
                              <div className="col-span-1 flex items-center justify-center">
                                <Button
                                    className="border-none bg-transparent text-black outline-none hover:text-orange"
                                    onClick={handleDeletePurchase(purchase?.id)}
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

                <div className="sticky bottom-0 left-0 z-10 mt-4 border border-t-gray-500/20 bg-white shadow-lg">
                  <div className="grid grid-cols-12 items-center gap-5 px-8 py-5">
                    <div className="col-span-12 xl:col-span-6">
                      <div className="flex items-center">
                        <input
                            checked={isCheckAllPurchase}
                            onChange={toggleCheckAllPurchase}
                            type="checkbox"
                            className="h-5 w-5 rounded border accent-orange outline-none"
                        />
                        <div className="ml-6 flex gap-8">
                          <Button
                              onClick={toggleCheckAllPurchase}
                              className="border-none bg-transparent text-gray-700 outline-none"
                          >
                            Chọn tất cả ({listCart.length})
                          </Button>
                          <Button
                              className="border-none bg-transparent text-gray-700 outline-none"
                              onClick={handleDeleteManyPurchases}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 xl:col-span-6">
                      <div className="flex flex-col gap-2">
                        {selectedAddress ? (
                            <div className="text-sm">
                              <p><strong>Giao tới:</strong> {selectedAddress.name}, {selectedAddress.phone}</p>
                              <p>{selectedAddress.specific}, {selectedAddress.commune}, {selectedAddress.district}, {selectedAddress.provincial}</p>
                              {selectedAddress.default && <span className="text-green-500">[Mặc định]</span>}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Chưa có địa chỉ giao hàng</p>
                        )}
                        <Button
                            className="border-none bg-transparent text-orange outline-none hover:text-orange-600"
                            onClick={handleOpenManageAddressDialog}
                        >
                          {selectedAddress ? 'Thay đổi địa chỉ' : 'Thêm địa chỉ'}
                        </Button>

                        <div className="flex items-center justify-between gap-6 sm:gap-2 xl:justify-end">
                          <div>
                          <div className="flex items-center gap-2">
                              <Button
                                className="border bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                onClick={handleOpenVoucherDialog}
                              >
                                Danh sách voucher
                              </Button>
                          </div>
                          <div className="flex items-center gap-1">
                              <p className="text-[12px] sm:text-[16px]">Tổng thanh toán ({(checkedPurchasesCount*(1-(selectedVoucher?.discount||0)))}): </p>
                                <span className="text-lg text-orange md:text-2xl">
                                  ₫{formatCurrency(Math.max(totalCheckedPurchasePrice - ((selectedVoucher?.discount) *totalCheckedPurchasePrice || 0), 0))}
                                </span>
                            </div>
                            <div className="grid grid-cols-12 items-center">
                              <span className="col-span-8 text-right text-[12px] sm:text-[16px] lg:col-span-10">Tiết kiệm</span>
                              <span className="col-span-4 text-right text-orange lg:col-span-2">
                              ₫{formatCurrency((selectedVoucher?.discount || 0) * totalCheckedPurchasePrice)}</span>
                            </div>
                          </div>
                          <Button
                              className="flex h-11 w-[100px] items-center justify-center rounded-sm bg-orange text-[12px] capitalize text-white sm:w-[150px] sm:text-[16px] md:w-[200px]"
                              disabled={buyProductMutation.isLoading || !selectedAddress || checkedPurchasesCount === 0}
                              onClick={handleBuyProduct}
                          >
                            Mua hàng
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-10">
                <img src={noproduct} alt="no-product" className="h-28 w-28" />
                <div className="text-sm font-bold text-gray-400">Giỏ hàng của bạn còn trống</div>
                <Button className="flex h-9 w-[100px] items-center justify-center rounded-sm bg-orange text-[12px] capitalize text-white sm:w-[150px] sm:text-[16px] md:w-[160px]">
                  <Link to={path.home} className="uppercase">mua ngay</Link>
                </Button>
              </div>
          )}

          {/* Address Dialog */}
          <Dialog open={openAddressDialog} onClose={handleCloseAddressDialog} maxWidth="md" fullWidth>
            <DialogTitle>{dataAddress?.length != 0? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>Họ và tên <span style={{ color: 'red' }}>*</span></Typography>
              <input
                  type="text"
                  value={newAddress.name}
                  onChange={handleInputChange('name')}
                  className="w-full p-2 border rounded"
              />
              {errors.name && <Typography color="error">{errors.name}</Typography>}

              <Typography gutterBottom>Số điện thoại <span style={{ color: 'red' }}>*</span></Typography>
              <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={handleInputChange('phone')}
                  className="w-full p-2 border rounded"
              />
              {errors.phone && <Typography color="error">{errors.phone}</Typography>}

              <Typography gutterBottom>Tỉnh/Thành phố <span style={{ color: 'red' }}>*</span></Typography>
              <select
                  value={newAddress.provincial}
                  onChange={handleInputChange('provincial')}
                  className="w-full p-2 border rounded"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {listProvincial?.map((province) => (
                    <option key={province?.id} value={province?.id}>
                      {province?.nameAddress}
                    </option>
                ))}
              </select>
              {errors.provincial && <Typography color="error">{errors.provincial}</Typography>}

              <Typography gutterBottom>Quận/Huyện <span style={{ color: 'red' }}>*</span></Typography>
              <select
                  value={newAddress.district}
                  onChange={handleInputChange('district')}
                  className="w-full p-2 border rounded"
                  disabled={!newAddress.provincial}
              >
                <option value="">Chọn quận/huyện</option>
                {newAddress.provincial &&
                    district?.map((district) => (
                        <option key={district?.id} value={district?.id}>
                          {district?.nameAddress}
                        </option>
                    ))}
              </select>
              {errors.district && <Typography color="error">{errors.district}</Typography>}

              <Typography gutterBottom>Phường/Xã <span style={{ color: 'red' }}>*</span></Typography>
              <select
                  value={newAddress.commune}
                  onChange={handleInputChange('commune')}
                  className="w-full p-2 border rounded"
                  disabled={!newAddress.district}
              >
                <option value="">Chọn xã/phường</option>
                {newAddress.district &&
                    comute?.map((comute) => (
                        <option key={comute?.id} value={comute?.id}>
                          {comute?.nameAddress}
                        </option>
                    ))}
              </select>
              {errors.commune && <Typography color="error">{errors.commune}</Typography>}

              <Typography gutterBottom>Địa chỉ cụ thể</Typography>
              <input
                  type="text"
                  value={newAddress.specific}
                  onChange={handleInputChange('specific')}
                  className="w-full p-2 border rounded"
              />
              {errors.specific && <Typography color="error">{errors.specific}</Typography>}

              <div className="mt-4">
                <Typography gutterBottom>Đặt làm địa chỉ mặc định</Typography>
                <button
                    onClick={() => setNewAddress((prev) => ({ ...prev, default: !prev.default }))}
                    className={`w-full p-2 border rounded text-white ${newAddress.default ? 'bg-green-500' : 'bg-gray-500'}`}
                >
                  {newAddress.default ? 'Đã đặt mặc định' : 'Đặt làm mặc định'}
                </button>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                  onClick={handleCloseAddressDialog}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded"
              >
                Hủy
              </Button>
              <Button
                  onClick={newAddress.id ? handleUpdateAddress : handleSubmitAddress}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded"
              >
                {newAddress.id ? 'Cập nhật' : 'Thêm'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Manage Address Dialog */}
          <Dialog open={openManageAddressDialog} onClose={handleCloseManageAddressDialog} maxWidth="md" fullWidth>
            <DialogTitle>Quản lý địa chỉ</DialogTitle>
            <DialogContent dividers>
              {dataAddress?.length > 0 ? (
                  dataAddress?.map((address) => (
                      <div key={address.id} className="flex justify-between items-center p-2 border-b">
                        <div>
                          <p>
                            <strong>{address.name}</strong> - {address.phone}
                          </p>
                          <p>
                            {address.detail}, {address.commune}, {address.district}, {address.province}
                          </p>
                          {address.default && <span className="text-green-500">[Mặc định]</span>}
                        </div>
                        <div className="flex gap-2">
                          <Button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                              onClick={() => handleEditAddress(address)}
                          >
                            Sửa
                          </Button>
                          <Button
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                              onClick={() => handleSelectAddress(address)}
                          >
                            Chọn
                          </Button>
                        </div>
                      </div>
                  ))
              ) : (
                  <Typography>Chưa có địa chỉ nào.</Typography>
              )}
              <Button
                  className="mt-4 bg-orange hover:bg-orange-600 text-white font-medium px-4 py-2 rounded"
                  onClick={handleClickOpenAddressDialog}
              >
                Thêm địa chỉ mới
              </Button>
            </DialogContent>
            <DialogActions>
              <Button
                  onClick={handleCloseManageAddressDialog}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded"
              >
                Đóng
              </Button>
            </DialogActions>
          </Dialog>

          {/* Related Products */}
          <div className="container mt-4">
            {productRelateList?.products?.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="uppercase text-gray-500">có thể bạn cũng thích</span>
                    <Link to={path.home} className="flex items-center gap-1 text-sm capitalize text-orange">
                      xem tất cả{' '}
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-4 w-4 stroke-orange"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                    {productRelateList.products.map((product) => (
                        <Product key={product._id} product={product} />
                    ))}
                  </div>
                </>
            )}
          </div>
        </div>
      {/* Voucher Dialog */}
      <Dialog open={openVoucherDialog} onClose={handleCloseVoucherDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Danh sách Voucher</DialogTitle>
        <DialogContent dividers>
          <Table
            dataSource={vouchers}
            rowKey="code"
            pagination={false}
            columns={[
              { title: 'Mã CODE', key: 'code' , render : (_, record) => `${record.code}`},
              { title: 'Tên voucher', dataIndex: 'description', key: 'description' },
              {
                title: 'Tỉ lệ giảm',
                key: 'discountAmount',
                render: (_, record) => `${formatCurrency(record.discount * 100 || 0)}%`
              },
              {
                title: 'Chọn',
                key: 'action',
                render: (_, record) => (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setSelectedVoucher(record);
                      message.success(`Đã chọn voucher ${record.code}`);
                      handleCloseVoucherDialog();
                    }}
                  >
                    Chọn
                  </Button>
                )
              }
            ]}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseVoucherDialog}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}