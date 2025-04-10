import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Form, Input, 
  Select, Switch, message, Popconfirm, Typography, Tag, Tabs
} from 'antd';
import { 
  LockOutlined, UnlockOutlined, DeleteOutlined, 
  UserOutlined, SearchOutlined, FilterOutlined 
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminManager } from "../../api/admin.api.ts";
import { DataFilterUser, DataRenderUser, UserAdmin } from "../../Responses/useradmin.type.ts";

const { Title } = Typography;
const { Option } = Select;

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [filter, setFilter] = useState({ status: 'all' });
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  useEffect(() => {
    applyFilters();
  }, [accounts, filter]);

  const applyFilters = () => {
    let filtered = [...accounts];

    if (filter.status !== 'all') {
      filtered = filtered.filter(account => account.status === filter.status);
    }

    setFilteredAccounts(filtered);
  };

  const buildSearchBody = (values) => {
    const { searchText, searchField } = values;
    const body = {};

    body[searchField] = searchText || null;

    // Thêm filter nếu cần gửi đi cùng body
    if (filter.status !== 'all') {
      body.status = filter.status;
    }

    return body;
  };

  const queryClient = useQueryClient();

  const decentralization = useMutation({
    mutationFn: (data:{key: string, userId: string})=> AdminManager.decentralization(data.key,  data.userId),
    onSuccess: () => {
      message.success("Thành Công");
      queryClient.invalidateQueries(['dataUser']);
    },
    onError:(error, variables, context)=>{message.error("Thất bại")}
  })

  const {data: dataUser} = useQuery(({
    queryKey: ['dataUser'],
    queryFn: () => AdminManager.getUserAdmin([], [])
  }))
  let listUserAdmin : UserAdmin = dataUser?.data?.content
  console.log(listUserAdmin)

  let dataRenderUser : DataRenderUser[] =  listUserAdmin?.map((data: UserAdmin)=>({
    id: data.id,
    username: data.username,
    phone: data.phoneNumber,
    role: data.roles=="ROLE_USER"? "user": "moderator",
    status: data ? "active": "locked",
    fullName: data.fullName,
    lastLogin: data.lastLogin || "Mới kích hoạt"
  }))


  useEffect(() => {
    if (dataUser?.data?.content) {
      const listUserAdmin: UserAdmin[] = dataUser.data.content;

      const dataRenderUser: DataRenderUser[] = listUserAdmin.map((data: UserAdmin) => ({
        id: data.id,
        username: data.username,
        phone: data.phoneNumber,
        role: data.roles === "ROLE_USER" ? "user" : "moderator",
        status: data.active ? "active" : "locked",
        fullName: data.fullName,
        lastLogin: data.lastLogin || "Mới kích hoạt",
      }));

      setAccounts(dataRenderUser);
      setPagination({
        current: dataUser.data.number + 1,
        pageSize: dataUser.data.size,
        total: dataUser.data.totalElements
      });
    }
  }, [dataUser]);

  const filterAccount= useMutation({
    mutationFn: (data: string[])=> AdminManager.getUserAdmin(
        [data[0], "page"],
        [data[1], data[2]]
    ),
    onSuccess: (res) => {
      let listUserAdmin : UserAdmin = res?.data?.content
      let dataRenderUser : DataRenderUser[] =  listUserAdmin?.map((data: UserAdmin)=>({
        id: data.id,
        username: data.username,
        phone: data.phoneNumber,
        role: data.roles=="ROLE_USER"? "user": "moderator",
        status: data ? "active": "locked",
        fullName: data.fullName,
        lastLogin: data.lastLogin || "Mới kích hoạt"
      }))
      setAccounts(dataRenderUser)
    }
  })

  const handleSearch = (values) => {
    console.log('Trường được chọn để tìm kiếm:', values.searchField);
    const body = buildSearchBody(values);
    console.log(values)
    console.log('Search body to send API:', body);
    filterAccount.mutate([values.searchField, values.searchText. pagination.current])

    if (!values.searchText) {
      applyFilters();
      return;
    }

    const filtered = accounts.filter(account =>
      account[values.searchField]?.toLowerCase().includes(values.searchText.toLowerCase())
    );
    setFilteredAccounts(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilter(prev => ({ ...prev, [filterType]: value }));
  };

  const showRoleModal = (account) => {
    setCurrentAccount(account);
    form.setFieldsValue({ role: account.role });
    console.log(form)
    setRoleModalVisible(true);
  };

  const handleRoleChange = async (values) => {
    try {
      await decentralization.mutateAsync({ key: values.role, userId: currentAccount.id });
      const res = await AdminManager.getUserAdmin([], []);
      const listUserAdmin: UserAdmin[] = res.data.content;
      const dataRenderUser: DataRenderUser[] = listUserAdmin.map((data: UserAdmin) => ({
        id: data.id,
        username: data.username,
        phone: data.phoneNumber,
        role: data.roles === "ROLE_USER" ? "user" : "moderator",
        status: data.active ? "active" : "locked",
        fullName: data.fullName,
        lastLogin: data.lastLogin || "Mới kích hoạt"
      }));
      setAccounts(dataRenderUser);
      message.success('Cập nhật quyền tài khoản thành công');
      setRoleModalVisible(false);
    } catch (error) {
      message.error('Lỗi khi cập nhật quyền tài khoản');
    }
  };

  const handleToggleStatus = async (account) => {
    try {
      decentralization.mutate({key: "lock", userId: account.id})
      const newStatus = account.status === 'active' ? 'locked' : 'active';
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
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
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
          initialValues={{ searchField: 'username' }}
        >
          <Form.Item name="searchText">
            <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm tài khoản" />
          </Form.Item>
          <Form.Item name="searchField">
            <Select style={{ width: 140 }}>
              <Option value="username">Tên người dùng</Option>
              <Option value="phone">Số điện thoại</Option>
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
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => {
            setPagination(prev => {
              const newPagination = { ...prev, current: page, pageSize };
              filterAccount.mutate([searchForm.getFieldValue("searchField"), searchForm.getFieldValue("searchText"), (page).toString()]);
              return newPagination;
            });
          }
        }}
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