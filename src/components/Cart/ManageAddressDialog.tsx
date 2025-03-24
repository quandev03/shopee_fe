import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from 'src/components/Button';
import Typography from '@mui/material/Typography';

interface ManageAddressDialogProps {
    open: boolean;
    onClose: () => void;
    addresses: any[]; // Thay 'any' bằng kiểu dữ liệu cụ thể nếu có
    handleEditAddress: (address: any) => void;
    handleDeleteAddress: (id: string) => void;
    handleSelectAddress: (address: any) => void;
    handleClickOpenAddressDialog: () => void;
}

const ManageAddressDialog: React.FC<ManageAddressDialogProps> = ({
                                                                     open,
                                                                     onClose,
                                                                     addresses,
                                                                     handleEditAddress,
                                                                     handleDeleteAddress,
                                                                     handleSelectAddress,
                                                                     handleClickOpenAddressDialog
                                                                 }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                <Button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ManageAddressDialog;