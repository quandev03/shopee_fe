import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Typography,
  Tag,
  DatePicker,
  Switch,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import {useMutation, useQuery} from "@tanstack/react-query";
import {RequestCreateVoucherDTO} from "../../Request/RequestCreateVoucher.type.ts";
import {AdminManager} from "../../api/admin.api.ts";
import {toast} from "react-toastify";
import {VoucherResponse} from "../../Responses/VoucherResponse.ts";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [isLimited, setIsLimited] = useState(false);

  const createVoucher = useMutation({
    mutationFn : (body: RequestCreateVoucherDTO) => AdminManager.createVoucher(body),
    onSuccess: ()=>{toast.success("Create voucher sussess")}
  })

  const { data: vouchersResponse } = useQuery({
    queryKey: ['vouchersResponse'],
    queryFn: () => AdminManager.getAllVoucher()
  });
  console.log(vouchersResponse?.content)
  let listVoucher: VoucherResponse[] = vouchersResponse?.data?.content
  console.log(listVoucher)
  useEffect(() => {
    if (listVoucher) {
      const mapped = listVoucher.map((item, index) => ({
        id: index + 1,
        code: item.voucherCode,
        name: `Voucher ${item.voucherCode}`,
        description: item.description,
        discount: item.discount * 100,
        limitSlot: item.limitSlot,
        isLimitedUsage: true,
        slotUsage: 1,
        startDate: moment(item.startDate),
        endDate: moment(item.expirationDate),
      }));
      setVouchers(mapped);
    }
  }, [listVoucher]);

  const discountOptions = [10, 20, 25, 30, 40, 50, 60, 70, 80, 90];

  const columns = [
    {
      title: 'Mã voucher',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount) => <Tag color="blue">{discount}%</Tag>,
    },
    {
      title: 'Số lượng voucher',
      dataIndex: 'limitSlot',
      key: 'limitSlot',
    },
    {
      title: 'Giới hạn người dùng',
      key: 'usageLimit',
      render: (_, record) =>
        record.isLimitedUsage
          ? `Mỗi người dùng ${record.slotUsage} lần`
          : 'Không giới hạn',
    },
    {
      title: 'Thời gian áp dụng',
      key: 'time',
      render: (text, record) => (
        <span>
          {moment(record.startDate).format('DD/MM/YYYY HH:mm')} - {moment(record.endDate).format('DD/MM/YYYY HH:mm')}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      startDate: moment(record.startDate),
      endDate: moment(record.endDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa voucher này?',
      onOk() {
        setVouchers(vouchers.filter(item => item.id !== id));
        message.success('Đã xóa voucher thành công');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const [startDate, endDate] = values.time;
      const rest = { ...values };
      delete rest.time;

      const newVoucher = {
        id: Date.now(),
        ...rest,
        startDate: startDate.format('DD/MM/YYYY HH:mm:ss'),
        endDate: endDate.format('DD/MM/YYYY HH:mm:ss'),
      };

      let body: RequestCreateVoucherDTO = {
        discount: newVoucher.discount,
        voucherCode: newVoucher.code,
        description: newVoucher.description,
        startDate: newVoucher.startDate,
        expirationDate: newVoucher.endDate,
        limitSlot: newVoucher.limitSlot,
        isLimitedUsage: newVoucher.isLimitedUsage,
        slotUsage: newVoucher.isLimitedUsage ? newVoucher.slotUsage : 0
      };

      if (editingId === null) {
        // Thêm mới
        setVouchers([...vouchers, newVoucher]);
        createVoucher.mutate(body);
      } else {
        // Cập nhật
        setVouchers(vouchers.map(item =>
          item.id === editingId ? {
            ...item,
            ...rest,
            startDate: startDate.format('DD/MM/YYYY HH:mm:ss'),
            endDate: endDate.format('DD/MM/YYYY HH:mm:ss'),
          } : item
        ));
        message.success('Cập nhật voucher thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={2}>Quản lý Voucher</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm Voucher
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="id"
      />

      <Modal
        title={editingId === null ? "Thêm Voucher" : "Sửa Voucher"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="code"
            label="Mã voucher"
          >
            <Input placeholder="Nhập mã voucher (không bắt buộc)" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên voucher"
            rules={[{ required: true, message: 'Vui lòng nhập tên voucher' }]}
          >
            <Input placeholder="Nhập tên voucher" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea placeholder="Nhập mô tả" />
          </Form.Item>

          <Form.Item
            name="discount"
            label="Giảm giá (%)"
            rules={[{ required: true, message: 'Vui lòng chọn mức giảm giá' }]}
          >
            <Select placeholder="Chọn mức giảm giá">
              {discountOptions.map(value => (
                <Option key={value} value={value}>{value}%</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="time"
            label="Thời gian áp dụng"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng' }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder={['Bắt đầu', 'Kết thúc']}
            />
          </Form.Item>

          <Form.Item
            name="limitSlot"
            label="Số lượng voucher"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng voucher' }]}
            initialValue={100}
          >
            <Input type="number" min={1} placeholder="Nhập số lượng voucher" />
          </Form.Item>

          <Form.Item
            name="isLimitedUsage"
            label="Giới hạn cho mỗi người dùng"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch onChange={(checked) => {
              setIsLimited(checked);
              if (!checked) {
                form.setFieldsValue({ slotUsage: undefined });
              }
            }} />
          </Form.Item>

          <Form.Item
            name="slotUsage"
            label="Số lần mỗi người được sử dụng"
            rules={[{ required: isLimited, message: 'Vui lòng nhập số lần sử dụng' }]}
          >
            <Input type="number" min={1} placeholder="Số lần tối đa mỗi người dùng" disabled={!isLimited} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vouchers;