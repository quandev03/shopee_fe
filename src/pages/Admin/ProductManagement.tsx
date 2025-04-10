import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Upload, Typography, Dropdown, Menu } from 'antd';
import {
  PlusOutlined, EditOutlined, EyeOutlined,
  DeleteOutlined, UploadOutlined, FilterOutlined
} from '@ant-design/icons';
import {useMutation, useQuery} from "@tanstack/react-query";
import {AdminManager} from "../../api/admin.api.ts";
import {CategoryResponse, ProductResponse} from "../../Responses/ProductResponse.type.ts";
import {CreateProductRequest} from "../../Request/CreateProductRequest.type.ts";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const { data: productResponse, refetch: refetchProducts } = useQuery({
    queryKey: ['productResponse'],
    queryFn: () => AdminManager.getAllProduct(),
    onSuccess: (data) => {
      const mappedProducts = data.data.map((product: ProductResponse) => ({
        id: product.id,
        name: product.nameProduct,
        price: product.price,
        category: product.category?.name || "Không xác định",
        stock: product.quantity,
        image: product.image,
      }));
      setProducts(mappedProducts);
    }
  });

  const { data: categoryResponse, refetch: refetchCategories } = useQuery({
    queryKey: ['categoryResponse'],
    queryFn: () => AdminManager.getCategory(),
    onSuccess: (data) => {
      const mappedCategories = data.data.map((cat: CategoryResponse) => ({
        id: cat.id,
        name: cat.name,
        products: [],
      }));
      setCategories(mappedCategories);
    }
  });

  const createCategory = useMutation({
    mutationFn:(body: {name:string})=>AdminManager.createCategory(body),
    onSuccess: () => {
      message.success("Tạo thành công");
      refetchCategories();
    },
    onError:()=>{
      message.error("Tạo thất bại")
    }
  })

  const uploadImageProduct = useMutation({
    mutationFn: ({ file, productId, isDefault }: { file: File, productId: string, isDefault: boolean }) =>
      AdminManager.uploadProductImage(file, productId, isDefault)
  });


  const createProduct = useMutation({
    mutationFn: (body: CreateProductRequest) => AdminManager.createProduct(body),
    onSuccess: (response)=>{
      console.log(response)},
    onError: (error)=>{
      message.error(error?.message)
    }
  })

  const showAddModal = () => {
    setCurrentProduct(null);
    form.resetFields();
    setImageUrls([]);
    setFileList([]);
    setModalVisible(true);
  };

  const showEditModal = (product) => {
    setCurrentProduct(product);
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description || '',
    });
    setImageUrls([product.image]);
    setFileList([{
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: product.image,
    }]);
    setModalVisible(true);
  };

  const showDetailModal = (product) => {
    setCurrentProduct(product);
    setDetailModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // Giả lập API call
      setTimeout(() => {
        setProducts(products.filter(item => item.id !== id));
        message.success('Xóa sản phẩm thành công');
      }, 500);
    } catch (error) {
      message.error('Lỗi khi xóa sản phẩm');
    }
  };

  const handleSave = async (values) => {
    try {
      console.log("FileList trước khi upload:", fileList);
      const filesToUpload = fileList.map(file => file.originFileObj).filter(Boolean);
      console.log("FilesToUpload:", filesToUpload);
      if (currentProduct) {
        // Cập nhật sản phẩm
        const updatedProducts = products.map(item =>
          item.id === currentProduct.id
            ? { ...item, ...values, image: imageUrls[0] || item.image }
            : item
        );
        setProducts(updatedProducts);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        // Thêm sản phẩm mới


        const newProduct = {
          ...values,
          image: imageUrls[0] || 'https://example.com/placeholder.jpg'
        };

        console.log(newProduct)
        let bodyCreate: CreateProductRequest  = {
          nameProduct: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          quantity: newProduct.stock,
          soldQuantity: 0
        }
        createProduct.mutate(bodyCreate, {
          onSuccess: async (response) => {
            const productId = response.data.id;
            for (let i = 0; i < imageUrls.length; i++) {
              const base64 = imageUrls[i];
              console.log(base64)
              const file = base64ToFile(base64, `${productId}-${i + 1}.png`);
              console.log(file)
              const isDefault = i === 0;
              await uploadImageProduct.mutateAsync({ file, productId, isDefault });
            }
            message.success('Thêm sản phẩm thành công');
            await refetchProducts();
            setProducts([...products, {
              ...bodyCreate,
              id: productId,
              image: imageUrls[0] || 'https://example.com/placeholder.jpg',
              name: bodyCreate.nameProduct,
              price: bodyCreate.price,
              stock: bodyCreate.quantity,
              category: null
            }]);
            setModalVisible(false);
          },
          onError: (error) => {
            message.error('Lỗi khi tạo sản phẩm: ' + error?.message);
          }
        });




        setProducts([...products, newProduct]);
        message.success('Thêm sản phẩm thành công');
        await refetchProducts();
      }
      setModalVisible(false);
    } catch (error) {
      message.error('Lỗi khi lưu sản phẩm');
    }
  };

  const handleAddCategory = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingId === null) {
        createCategory.mutate({ name: values.name });
        setIsModalVisible(false);
        form.resetFields();
      } else {
        // Cập nhật danh mục
        setCategories(categories.map(item =>
          item.id === editingId ? { ...item, name: values.name } : item
        ));
        message.success('Cập nhật danh mục thành công');
        setIsModalVisible(false);
        form.resetFields();
      }
    });
  };

  const handleEditCategory = (category) => {
    setEditingId(category.id);
    form.setFieldsValue({ name: category.name });
    setIsModalVisible(true);
  };

  const handleViewProducts = (category) => {
    // Logic để hiển thị sản phẩm thuộc danh mục
    console.log('Sản phẩm thuộc danh mục:', category);
    // Bạn có thể mở một modal hoặc điều hướng đến trang sản phẩm
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) =>
        image ? (
          <img src={image} alt="Sản phẩm" style={{ width: 50, height: 50, objectFit: 'cover' }} />
        ) : (
          <span>Không có ảnh</span>
        )
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN').format(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
            type="primary"
            ghost
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            type="primary"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columns2 = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'products',
      key: 'products',
      render: (products) => products.length, // Hiển thị số lượng sản phẩm
    },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewProducts(record)}>Chi tiết</Button>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    beforeUpload: (file) => {
      if (fileList.length >= 5) {
        message.warning("Chỉ được chọn tối đa 5 ảnh");
        return Upload.LIST_IGNORE;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log("Ảnh vừa chọn:", file);
        console.log("Base64 preview:", reader.result);
        const base64 = reader.result as string;
        setImageUrls(prev => [...prev, base64]);
        setFileList(prev => [
          ...prev,
          {
            uid: file.uid,
            name: file.name,
            status: 'done',
            url: base64,
            originFileObj: file, // ✅ THÊM DÒNG NÀY
          },
        ]);
      };
      return false;
    },
    onRemove: (file) => {
      setFileList(prev => prev.filter(item => item.uid !== file.uid));
      setImageUrls(prev => prev.filter((_, i) => fileList[i]?.uid !== file.uid));
    },
    fileList: fileList,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Sản phẩm</Title>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm theo tên..."
          allowClear
          enterButton="Tìm"
          style={{ width: 250 }}
          onSearch={(value) => {
            const filtered = products?.filter(product =>
              product.name.toLowerCase().includes(value.toLowerCase())
            );
            setProducts(filtered);
          }}
        />
        <Dropdown
          overlay={
            <Menu
              onClick={({ key }) => {
                let sorted = [...products];
                if (key === 'name_asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
                else if (key === 'name_desc') sorted.sort((a, b) => b.name.localeCompare(a.name));
                else if (key === 'price_asc') sorted.sort((a, b) => a.price - b.price);
                else if (key === 'price_desc') sorted.sort((a, b) => b.price - a.price);
                setProducts(sorted);
              }}
              items={[
                { label: 'Tên A-Z', key: 'name_asc' },
                { label: 'Tên Z-A', key: 'name_desc' },
                { label: 'Giá tăng dần', key: 'price_asc' },
                { label: 'Giá giảm dần', key: 'price_desc' },
              ]}
            />
          }
          trigger={['click']}
        >
          <Button icon={<FilterOutlined />}>Tuỳ chọn sắp xếp</Button>
        </Dropdown>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        title={currentProduct ? "Sửa thông tin sản phẩm" : "Thêm sản phẩm mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1000} step={1000} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories?.map(cat => (
                  <Option key={cat.id} value={cat.id}>{cat.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="stock"
            label="Tồn kho"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Hình ảnh sản phẩm">
            <Upload
              listType="picture-card"
              showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
              {...uploadProps}
            >
              {fileList.length >= 5 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 16 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {currentProduct ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết sản phẩm */}
      <Modal
        title="Chi tiết sản phẩm"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {currentProduct && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                style={{ maxWidth: '100%', maxHeight: 300 }}
              />
            </div>

            <p><strong>ID:</strong> {currentProduct.id}</p>
            <p><strong>Tên sản phẩm:</strong> {currentProduct.name}</p>
            <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN').format(currentProduct.price)} VNĐ</p>
            <p><strong>Danh mục:</strong> {currentProduct.category}</p>
            <p><strong>Tồn kho:</strong> {currentProduct.stock}</p>
            <p><strong>Mô tả:</strong> {currentProduct.description || 'Không có mô tả'}</p>
          </div>
        )}
      </Modal>

      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={2}>Quản lý danh mục sản phẩm</Title>
        <Button type="primary" onClick={handleAddCategory}>Thêm danh mục sản phẩm</Button>
      </Space>

      <Table
        columns={columns2}
        dataSource={categories}
        rowKey="id"
      />

      <Modal
        title={editingId === null ? "Thêm danh mục sản phẩm" : "Sửa danh mục sản phẩm"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;