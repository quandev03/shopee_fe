import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Form, Input, 
  InputNumber, Select, message, Popconfirm, Upload, Typography 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, EyeOutlined, 
  DeleteOutlined, UploadOutlined 
} from '@ant-design/icons';

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
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Giả lập API call
      setTimeout(() => {
        const mockProducts = [
          { id: 1, name: 'Sản phẩm 1', price: 100000, category: 'Điện thoại', stock: 20, image: 'https://example.com/img1.jpg' },
          { id: 2, name: 'Sản phẩm 2', price: 200000, category: 'Laptop', stock: 15, image: 'https://example.com/img2.jpg' },
          { id: 3, name: 'Sản phẩm 3', price: 300000, category: 'Phụ kiện', stock: 50, image: 'https://example.com/img3.jpg' },
        ];
        setProducts(mockProducts);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('Lỗi khi tải danh sách sản phẩm');
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setCurrentProduct(null);
    form.resetFields();
    setImageUrl('');
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
    setImageUrl(product.image);
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
      if (currentProduct) {
        // Cập nhật sản phẩm
        const updatedProducts = products.map(item => 
          item.id === currentProduct.id 
            ? { ...item, ...values, image: imageUrl || item.image } 
            : item
        );
        setProducts(updatedProducts);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        // Thêm sản phẩm mới
        const newProduct = {
          id: Math.max(...products.map(p => p.id), 0) + 1,
          ...values,
          image: imageUrl || 'https://example.com/placeholder.jpg'
        };
        setProducts([...products, newProduct]);
        message.success('Thêm sản phẩm thành công');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('Lỗi khi lưu sản phẩm');
    }
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
      render: (image) => <img src={image} alt="Sản phẩm" style={{ width: 50, height: 50, objectFit: 'cover' }} />
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN').format(price),
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

  const uploadProps = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      return false;
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Quản lý Sản phẩm</Title>
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
        pagination={{ pageSize: 10 }}
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
            <Select>
              <Option value="Điện thoại">Điện thoại</Option>
              <Option value="Laptop">Laptop</Option>
              <Option value="Máy tính bảng">Máy tính bảng</Option>
              <Option value="Phụ kiện">Phụ kiện</Option>
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
              showUploadList={false}
              {...uploadProps}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Sản phẩm" style={{ width: '100%' }} />
              ) : (
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
    </div>
  );
};

export default ProductManagement; 