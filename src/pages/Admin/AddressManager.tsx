import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Typography, message, Modal, Input } from 'antd';
import axios from 'axios';
import styled from 'styled-components';
import {useMutation} from "@tanstack/react-query";
import {AddressApi} from "../../api/address.api.ts";

const { Title } = Typography;

const Container = styled.div`
  padding: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  height: 100%;
  .ant-card-body {
    height: calc(100vh - 200px);
    overflow-y: auto;
  }
`;

const AddButton = styled(Button)`
  margin-top: 16px;
  width: 100%;
`;

interface Location {
  code: string;
  name: string;
}

const AddressManager: React.FC = () => {
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalLevel, setModalLevel] = useState<'province' | 'district' | 'ward' | null>(null);
  const [newName, setNewName] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);

  // Fetch provinces on component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
        getListProvince.mutate()
      // const response = await axios.get('https://provinces.open-api.vn/api/p/');
      // setProvinces(response.data.map((p: any) => ({ code: p.code, name: p.name })));
    } catch (error) {
      message.error('Không thể tải danh sách tỉnh thành');
    }
  };
  const getListProvince = useMutation({
      mutationFn: ()=> AddressApi.getListProvince(),
      onSuccess:(res)=>{
          console.log(res?.data)
          setProvinces(res?.data?.map((p: any) => ({ code: p.id, name: p.nameAddress })));
      }
  });
  const getDistricts = useMutation({
      mutationFn: (data:{id: string})=> AddressApi.getNextAddressLevel(data.id),
      onSuccess:(res)=>{
        console.log(res?.data)
        setDistricts(res?.data?.map((d: any) => ({ code: d.id, name: d.nameAddress })));
      }

  })

  const getWards = useMutation({
    mutationFn: (data:{id: string})=> AddressApi.getNextAddressLevel(data.id),
    onSuccess:(res)=>{
      console.log(res?.data)
      setWards(res?.data?.map((d: any) => ({ code: d.id, name: d.nameAddress })));
    }

  })

  const fetchDistricts = async (provinceCode: string) => {
    try {
      // const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      console.log("lay huyen")
      getDistricts.mutate({id:provinceCode})
      // setDistricts(response.data.districts.map((d: any) => ({ code: d.code, name: d.name })));
      setWards([]);
      setSelectedDistrict('');
      setSelectedWard('');
    } catch (error) {
      message.error('Không thể tải danh sách quận huyện');
    }
  };

  const fetchWards = async (districtCode: string) => {
    try {
      getWards.mutate({id:districtCode })
      setSelectedWard('');
    } catch (error) {
      message.error('Không thể tải danh sách phường xã');
    }
  };

  const handleProvinceChange = (value: string) => {
    console.log('ID tỉnh đã chọn:', value);
    setSelectedProvince(value);
    fetchDistricts(value);
  };

  const handleDistrictChange = (value: string) => {
    console.log('ID huyện đã chọn:', value);
    setSelectedDistrict(value);
    fetchWards(value);
  };

  const handleWardChange = (value: string) => {
    console.log('ID xã đã chọn:', value);
    setSelectedWard(value);
  };

  const showModal = (level: 'province' | 'district' | 'ward') => {
    setModalLevel(level);
    setIsModalVisible(true);
    setNewName('');
    if (level === 'province') {
      setParentId(null);
    } else if (level === 'district') {
      setParentId(selectedProvince);
    } else if (level === 'ward') {
      setParentId(selectedDistrict);
    }
  };

  const addNewAddress = useMutation({
    mutationFn:(data)=>AddressApi.addNewAddress(data),
    onSuccess :()=>message.success("Thêm thành công")
  })

  const handleModalOk = () => {
    if (!newName.trim()) {
      message.error('Tên không được để trống');
      return;
    }

    const level = modalLevel === 'province' ? 0 : modalLevel === 'district' ? 1 : 2;
    const address = {
      nameAddress: newName,
      addressLevel: level,
      beforeAddressId: parentId ?? ''
    };

    addNewAddress.mutate(address, {
      onSuccess: () => {
        message.success("Thêm thành công");
        setIsModalVisible(false);

        // Gọi lại API tương ứng sau khi thêm địa chỉ
        if (modalLevel === 'province') {
          fetchProvinces();
        } else if (modalLevel === 'district' && selectedProvince) {
          fetchDistricts(selectedProvince);
        } else if (modalLevel === 'ward' && selectedDistrict) {
          fetchWards(selectedDistrict);
        }
      }
    });

    console.log('Tên địa chỉ mới:', newName);
    console.log('Address:', address);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Container>
      <Title level={2}>Quản lý địa chỉ</Title>
      <Row gutter={16}>
        <Col span={8}>
          <StyledCard title="Tỉnh/Thành phố">
            <div>
              {provinces.map((province) => (
                <Button
                  key={province.code}
                  type={selectedProvince === province.code ? 'primary' : 'default'}
                  onClick={() => handleProvinceChange(province.code)}
                  style={{ margin: '4px', width: '100%' }}
                >
                  {province.name}
                </Button>
              ))}
            </div>
          </StyledCard>
          <AddButton type="primary" onClick={() => showModal('province')}>
            Thêm tỉnh/thành phố
          </AddButton>
        </Col>
        <Col span={8}>
          <StyledCard title="Quận/Huyện">
            <div>
              {districts.map((district) => (
                <Button
                  key={district.code}
                  type={selectedDistrict === district.code ? 'primary' : 'default'}
                  onClick={() => handleDistrictChange(district.code)}
                  style={{ margin: '4px', width: '100%' }}
                  disabled={!selectedProvince}
                >
                  {district.name}
                </Button>
              ))}
            </div>
          </StyledCard>
          <AddButton type="primary" onClick={() => showModal('district')} disabled={!selectedProvince}>
            Thêm quận/huyện
          </AddButton>
        </Col>
        <Col span={8}>
          <StyledCard title="Phường/Xã">
            <div>
              {wards.map((ward) => (
                <Button
                  key={ward.code}
                  type={selectedWard === ward.code ? 'primary' : 'default'}
                  onClick={() => handleWardChange(ward.code)}
                  style={{ margin: '4px', width: '100%' }}
                  disabled={!selectedDistrict}
                >
                  {ward.name}
                </Button>
              ))}
            </div>
          </StyledCard>
          <AddButton type="primary" onClick={() => showModal('ward')} disabled={!selectedDistrict}>
            Thêm phường/xã
          </AddButton>
        </Col>
      </Row>
      <Modal
        title="Thêm địa chỉ mới"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập tên"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <p style={{ marginTop: 8 }}>
          {modalLevel === 'district' && selectedProvince
            ? `Tỉnh: ${provinces.find(p => p.code === selectedProvince)?.name || ''}`
            : modalLevel === 'ward' && selectedDistrict
            ? `Huyện: ${districts.find(d => d.code === selectedDistrict)?.name || ''}`
            : modalLevel === 'province'
            ? 'Quốc gia: Việt Nam'
            : ''}
        </p>
      </Modal>
    </Container>
  );
};

export default AddressManager;
