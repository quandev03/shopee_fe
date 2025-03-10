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

const randomPage = randomInteger(1, 3).toString();
const provinces = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Hải Dương',
  'Nghệ An',
  'Thanh Hóa',
  'Đồng Nai',
  'Bình Dương',
  'Quảng Ninh',
  'Khánh Hòa',
  'Lâm Đồng',
  'Bà Rịa - Vũng Tàu',
  'An Giang'
];

const districts = {
  'Hà Nội': [
    'Ba Đình',
    'Hoàn Kiếm',
    'Hai Bà Trưng',
    'Đống Đa',
    'Tây Hồ',
    'Cầu Giấy',
    'Thanh Xuân',
    'Hoàng Mai',
    'Long Biên',
    'Bắc Từ Liêm',
    'Nam Từ Liêm',
    'Hà Đông'
  ],
  'Hồ Chí Minh': [
    'Quận 1',
    'Quận 2',
    'Quận 3',
    'Quận 4',
    'Quận 5',
    'Quận 6',
    'Quận 7',
    'Quận 8',
    'Quận 9',
    'Quận 10',
    'Quận 11',
    'Quận 12',
    'Bình Thạnh',
    'Gò Vấp',
    'Phú Nhuận',
    'Tân Bình',
    'Tân Phú',
    'Thủ Đức'
  ],
  'Đà Nẵng': [
    'Hải Châu',
    'Thanh Khê',
    'Sơn Trà',
    'Ngũ Hành Sơn',
    'Liên Chiểu',
    'Cẩm Lệ'
  ],
  'Hải Phòng': [
    'Hồng Bàng',
    'Lê Chân',
    'Ngô Quyền',
    'Kiến An',
    'Hải An',
    'Đồ Sơn',
    'Dương Kinh'
  ],
  'Cần Thơ': [
    'Ninh Kiều',
    'Cái Răng',
    'Bình Thủy',
    'Ô Môn',
    'Phong Điền',
    'Thốt Nốt'
  ],
  'Hải Dương': [
    'TP Hải Dương',
    'Chí Linh',
    'Kinh Môn',
    'Nam Sách',
    'Thanh Hà'
  ],
  'Nghệ An': [
    'TP Vinh',
    'Cửa Lò',
    'Hoàng Mai',
    'Quế Phong',
    'Quỳnh Lưu'
  ],
  'Thanh Hóa': [
    'TP Thanh Hóa',
    'Sầm Sơn',
    'Bỉm Sơn',
    'Nga Sơn',
    'Hậu Lộc'
  ],
  'Đồng Nai': [
    'Biên Hòa',
    'Long Khánh',
    'Trảng Bom',
    'Long Thành',
    'Nhơn Trạch'
  ],
  'Bình Dương': [
    'Thủ Dầu Một',
    'Dĩ An',
    'Thuận An',
    'Tân Uyên',
    'Bến Cát'
  ],
  'Quảng Ninh': [
    'Hạ Long',
    'Cẩm Phả',
    'Uông Bí',
    'Móng Cái',
    'Đông Triều'
  ],
  'Khánh Hòa': [
    'Nha Trang',
    'Cam Ranh',
    'Ninh Hòa',
    'Cam Lâm',
    'Vạn Ninh'
  ],
  'Lâm Đồng': [
    'Đà Lạt',
    'Bảo Lộc',
    'Di Linh',
    'Đơn Dương',
    'Lạc Dương'
  ],
  'Bà Rịa - Vũng Tàu': [
    'Vũng Tàu',
    'Bà Rịa',
    'Long Điền',
    'Đất Đỏ',
    'Xuyên Mộc'
  ],
  'An Giang': [
    'Long Xuyên',
    'Châu Đốc',
    'Tân Châu',
    'Châu Phú',
    'Chợ Mới'
  ]
};
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
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    provincial: '',
    district: '',
    commune: '',
    specific: ''
  });

  const status = purchasesStatus.inCart;
  const queryClient = useQueryClient();
  const location = useLocation();
  const purchaseChosenFromProductDetail = (location.state as { purchaseId: string } | null)?.purchaseId;
  const queryConfig: ProductListConfig = { page: randomPage, limit: '12' };

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
    mutationFn: (body: ProductCart) => purchasesApi.updatePurchases(body),
    onSuccess: () => refetch()
  });

  const deletePurchaseMutation = useMutation({
    mutationFn: (data: string[]) => purchasesApi.deletePurchases(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['purchasesCart', { status }] })
  });

  const buyProductMutation = useMutation({
    mutationFn: (body: ProductCart[]) => purchasesApi.buyProducts(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchasesCart', { status }] });
      toast.success(data.data.message, { position: 'top-center' });
    }
  });

  const handleClickOpenAddressDialog = () => {
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

    if (!newAddress.provincial) {
      newErrors.provincial = 'Vui lòng chọn tỉnh/thành phố';
      isValid = false;
    } else if (!provinces.includes(newAddress.provincial)) {
      newErrors.provincial = 'Tỉnh/thành phố không hợp lệ';
      isValid = false;
    }

    if (!newAddress.district) {
      newErrors.district = 'Vui lòng chọn quận/huyện';
      isValid = false;
    } else if (newAddress.provincial && districts[newAddress.provincial]) {
      if (!districts[newAddress.provincial].includes(newAddress.district)) {
        newErrors.district = 'Quận/huyện không hợp lệ';
        isValid = false;
      }
    }

    if (!newAddress.commune.trim()) {
      newErrors.commune = 'Vui lòng nhập phường/xã';
      isValid = false;
    } else if (newAddress.commune.trim().length < 2) {
      newErrors.commune = 'Phường/xã phải có ít nhất 2 ký tự';
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

  const productInCartData = purchasesData?.data.data;
  const isCheckAllPurchase = useMemo(() => extendsPurchases.every((purchase) => purchase.checked), [extendsPurchases]);
  const checkedPurchases = useMemo(() => extendsPurchases.filter((purchase) => purchase.checked), [extendsPurchases]);
  const checkedPurchasesCount = checkedPurchases.length;

  const totalCheckedPurchasePrice = useMemo(
    () => checkedPurchases.reduce((total, purchase) => total + purchase.buy_count * purchase.product.price, 0),
    [checkedPurchases]
  );

  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce(
        (total, purchase) =>
          total + (purchase.product.price_before_discount - purchase.product.price) * purchase.buy_count,
        0
      ),
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
    setExtendsPurchases(produce((draft) => draft.map((purchase) => ({ ...purchase, checked: !isCheckAllPurchase }))));
  };

  const checkPurchase = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendsPurchases(
      produce((draft) => {
        draft[index].checked = event.target.checked;
      })
    );
  };

  const handleQuantity = (productIndex: number, value: number, enable: boolean) => {
    if (!enable) return;
    setExtendsPurchases(produce((draft) => { draft[productIndex].disabled = true; }));
    updatePurchaseMutation.mutate({ buy_count: value, product_id: extendsPurchases[productIndex].product._id });
  };

  const handleTypeQuantity = (productIndex: number, value: number) => {
    setExtendsPurchases(produce((draft) => { draft[productIndex].buy_count = value; }));
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
    <div className="bg-neutral-100">
      <Helmet>
        <title>Giỏ hàng</title>
        <meta name="description" content="Giỏ hàng của bạn" />
      </Helmet>
      <div className="container">
        {extendsPurchases.length ? (
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
                {extendsPurchases?.map((purchase, index) => (
                  <div
                    className="mt-4 grid grid-cols-12 items-center bg-white px-12 py-5 shadow last:mb-4"
                    key={purchase._id}
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
                              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                              className="h-20 w-20 flex-shrink-0"
                            >
                              <img src={purchase.product.image} alt={purchase.product.name} />
                            </Link>
                            <Link
                              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                              className="ml-4 line-clamp-2 flex-grow"
                            >
                              {purchase.product.name}
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
                              <span className="text-sm text-gray-500">{formatCurrency(purchase.product.price_before_discount)}</span>
                            </div>
                            <div>
                              <span>₫</span>
                              <span className="text-sm">{formatCurrency(purchase.product.price)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <QuantityController
                            max={purchase.product.quantity}
                            value={purchase.buy_count}
                            classNameWrapper="m-0"
                            onDecrease={(value) => handleQuantity(index, value, value !== purchase.buy_count)}
                            onIncrease={(value) => handleQuantity(index, value, value < purchase.product.quantity)}
                            disabled={purchase.disabled}
                            onType={(value) => handleTypeQuantity(index, value)}
                            onFocusOut={(value) =>
                              handleQuantity(
                                index,
                                value,
                                value >= 1 && value < purchase.product.quantity && value !== (productInCartData as Purchases[])[index].buy_count
                              )
                            }
                          />
                        </div>
                        <div className="col-span-1 flex items-center justify-center text-orange">
                          <span>₫</span>
                          <span className="text-sm">{formatCurrency(purchase.product.price * purchase.buy_count)}</span>
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <Button
                            className="border-none bg-transparent text-black outline-none hover:text-orange"
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
                        Chọn tất cả ({extendsPurchases.length})
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
                        <div className="flex items-center gap-1">
                          <p className="text-[12px] sm:text-[16px]">Tổng thanh toán ({checkedPurchasesCount}): </p>
                          <span className="text-lg text-orange md:text-2xl">₫{formatCurrency(totalCheckedPurchasePrice)}</span>
                        </div>
                        <div className="grid grid-cols-12 items-center">
                          <span className="col-span-8 text-right text-[12px] sm:text-[16px] lg:col-span-10">Tiết kiệm</span>
                          <span className="col-span-4 text-right text-orange lg:col-span-2">
                            ₫{formatNumberToSocialStyle(totalCheckedPurchaseSavingPrice)}
                          </span>
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
          <DialogTitle>{newAddress.id ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</DialogTitle>
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
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
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
                districts[newAddress.provincial]?.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
            {errors.district && <Typography color="error">{errors.district}</Typography>}

            <Typography gutterBottom>Phường/Xã <span style={{ color: 'red' }}>*</span></Typography>
            <input
              type="text"
              value={newAddress.commune}
              onChange={handleInputChange('commune')}
              className="w-full p-2 border rounded"
            />
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
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div key={address.id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p>
                      <strong>{address.name}</strong> - {address.phone}
                    </p>
                    <p>
                      {address.specific}, {address.commune}, {address.district}, {address.provincial}
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
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Xóa
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
    </div>
  );
}