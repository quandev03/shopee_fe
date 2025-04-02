import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Form, Input, 
  Select, Switch, message, Popconfirm, Typography, Tag, Tabs
} from 'antd';
import { 
  LockOutlined, UnlockOutlined, DeleteOutlined, 
  UserOutlined, SearchOutlined, FilterOutlined 
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [filter, setFilter] = useState({ status: 'all', role: 'all' });
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [accounts, filter]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      // Giả lập API call
      setTimeout(() => {
        const mockAccounts = [
          { id: 1, username: 'user1', email: 'user1@example.com', fullName: 'Nguyễn Văn A', role: 'user', status: 'active', lastLogin: '2023-05-15' },
          { id: 2, username: 'user2', email: 'user2@example.com', fullName: 'Trần Thị B', role: 'user', status: 'active', lastLogin: '2023-05-10' },
          { id: 3, username: 'admin1', email: 'admin1@example.com', fullName: 'Lê Văn C', role: 'admin', status: 'active', lastLogin: '2023-05-14' },
          { id: 4, username: 'user3', email: 'user3@example.com', fullName: 'Phạm Thị D', role: 'user', status: 'locked', lastLogin: '2023-04-30' },
          { id: 5, username: 'mod1', email: 'mod1@example.com', fullName: 'Hoàng Văn E', role: 'moderator', status: 'active', lastLogin: '2023-05-12' },
        ];
        setAccounts(mockAccounts);
        setFilteredAccounts(mockAccounts);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('Lỗi khi tải danh sách tài khoản');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...accounts];
    
    if (filter.status !== 'all') {
      filtered = filtered.filter(account => account.status === filter.status);
    }
    
    if (filter.role !== 'all') {
      filtered = filtered.filter(account => account.role === filter.role);
    }
    
    setFilteredAccounts(filtered);
  };

  const handleSearch = (values) => {
    const { searchText, searchField } = values;
    
    if (!searchText) {
      applyFilters();
      return;
    }
    
    const filtered = accounts.filter(account => {
      if (searchField === 'all') {
        return (
          account.username.toLowerCase().includes(searchText.toLowerCase()) ||
          account.email.toLowerCase().includes(searchText.toLowerCase()) ||
          account.fullName.toLowerCase().includes(searchText.toLowerCase())
        );
      } else {
        return account[searchField].toLowerCase().includes(searchText.toLowerCase());
      }
    });
    
    setFilteredAccounts(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilter(prev => ({ ...prev, [filterType]: value }));
  };

  const showRoleModal = (account) => {
    setCurrentAccount(account);
    form.setFieldsValue({ role: account.role });
    setRoleModalVisible(true);
  };

  const handleRoleChange = async (values) => {
    try {
      const updatedAccounts = accounts.map(item => 
        item.id === currentAccount.id 
          ? { ...item, role: values.role }
          : item
      );
      setAccounts(updatedAccounts);
      message.success('Cập nhật quyền tài khoản thành công');
      setRoleModalVisible(false);
    } catch (error) {
      message.error('Lỗi khi cập nhật quyền tài khoản');
    }
  };

  const handleToggleStatus = async (account) => {
    try {
      const newStatus = account.status === 'active' ? 'locked' : 'active';
      const updatedAccounts = accounts.map(item => 
        item.id === account.id 
          ? { ...item, status: newStatus }
          : item
      );
      setAccounts(updatedAccounts);
      message.success(`Tài khoản đã được ${newStatus === 'active' ? 'mở khóa' : 'khóa'} thành công`);
    } catch (error) {
      message.error('Lỗi khi thay đổi trạng thái tài khoản');
    }
  };

  const handleDelete = async (id) => {
    try {
      setAccounts(accounts.filter(item => item.id !== id));
      message.success('Xóa tài khoản thành công');
    } catch (error) {
      message.error('Lỗi khi xóa tài khoản');
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
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'blue';
        if (role === 'admin') color = 'red';
        if (role === 'moderator') color = 'green';
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'active' ? 'green' : 'red';
        const text = status === 'active' ? 'Hoạt động' : 'Bị khóa';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary"
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record)}
            danger={record.status === 'active'}
          >
            {record.status === 'active' ? 'Khóa' : 'Mở khóa'}
          </Button>
          <Button 
            onClick={() => showRoleModal(record)}
            type="default"
          >
            Phân quyền
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tài khoản này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const accountTypes = [
    { key: 'all', tab: 'Tất cả' },
    { key: 'active', tab: 'Đang hoạt động' },
    { key: 'locked', tab: 'Đã khóa' },
  ];

  return (
    <div>
      <Title level={2}>Quản lý Tài khoản</Title>
      
      <div style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          initialValues={{ searchField: 'all' }}
        >
          <Form.Item name="searchText">
            <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm tài khoản" />
          </Form.Item>
          <Form.Item name="searchField">
            <Select style={{ width: 140 }}>
              <Option value="all">Tất cả</Option>
              <Option value="username">Tên người dùng</Option>
              <Option value="email">Email</Option>
              <Option value="fullName">Họ và tên</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <FilterOutlined style={{ marginRight: 8 }} />
        <span style={{ marginRight: 12 }}>Lọc theo quyền:</span>
        <Select
          value={filter.role}
          onChange={(value) => handleFilterChange('role', value)}
          style={{ width: 140, marginRight: 16 }}
        >
          <Option value="all">Tất cả</Option>
          <Option value="user">Người dùng</Option>
          <Option value="moderator">Kiểm duyệt</Option>
          <Option value="admin">Quản trị viên</Option>
        </Select>
      </div>
      
      <Tabs
        defaultActiveKey="all"
        items={accountTypes.map(item => ({
          key: item.key,
          label: item.tab,
        }))}
        onChange={(key) => handleFilterChange('status', key)}
      />

      <Table 
        columns={columns} 
        dataSource={filteredAccounts} 
        rowKey="id" 
        loading={loading} 
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Phân quyền tài khoản"
        open={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        footer={null}
      >
        {currentAccount && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleRoleChange}
          >
            <p><strong>Tài khoản:</strong> {currentAccount.username}</p>
            <p><strong>Email:</strong> {currentAccount.email}</p>
            
            <Form.Item
              name="role"
              label="Quyền"
              rules={[{ required: true, message: 'Vui lòng chọn quyền' }]}
            >
              <Select>
                <Option value="user">Người dùng</Option>
                <Option value="moderator">Kiểm duyệt viên</Option>
                <Option value="admin">Quản trị viên</Option>
              </Select>
            </Form.Item>

            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
              <Space>
                <Button onClick={() => setRoleModalVisible(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AccountManagement;