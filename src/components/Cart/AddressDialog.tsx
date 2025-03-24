import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from 'src/components/Button';
import Typography from '@mui/material/Typography';
import {Address} from "../../Responses/address.type.ts";

interface AddressDialogProps {
    open: boolean;
    onClose: () => void;
    newAddress: any; // Replace 'any' with a specific type if available
    setNewAddress: React.Dispatch<React.SetStateAction<any>>;
    errors: any; // Replace 'any' with a specific type if available
    validate: () => boolean;
    handleSubmitAddress: () => void;
    handleUpdateAddress: () => void;
    handleInputChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    listProvince: Address[];
    district: Address[];
    commune: Address[];
    onProvinceChange: React.Dispatch<React.SetStateAction<string>>;
    onDistrictChange: (districtId: string) => void;
}

const AddressDialog: React.FC<AddressDialogProps> = ({
                                                         open,
                                                         onClose,
                                                         newAddress,
                                                         setNewAddress,
                                                         errors,
                                                         validate,
                                                         handleSubmitAddress,
                                                         handleUpdateAddress,
                                                         handleInputChange,
                                                         listProvince,
                                                         district,
                                                         commune,
                                                         onProvinceChange,
                                                         onDistrictChange
                                                     }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                    name="provincial"
                    value={newAddress.provincial}
                    onChange={(event) => {
                        setNewAddress((prev) => ({ ...prev, provincial: event.target.value }));
                        onProvinceChange(event.target.value);
                    }}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {listProvince?.map((province) => (
                        <option key={province.id} value={province.id}>
                            {province.nameAddress}
                        </option>
                    ))}
                </select>
                {errors.provincial && <Typography color="error">{errors.provincial}</Typography>}

                <Typography gutterBottom>Quận/Huyện <span style={{ color: 'red' }}>*</span></Typography>
                <select
                    value={newAddress.district}
                    onChange={(event) => {
                        setNewAddress((prev) => ({ ...prev, district: event.target.value }));
                        onDistrictChange(event.target.value);
                    }}
                    className="w-full p-2 border rounded"
                    disabled={district.length === 0}
                >
                    <option value="">Chọn quận/huyện</option>
                    {district?.map((dis: Address) => (
                        <option key={dis.id} value={dis.id}>
                            {dis.nameAddress}
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
                <Button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded">
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
    );
};

export default AddressDialog;