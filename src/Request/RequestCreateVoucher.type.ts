// Voucher.type.ts

export interface RequestCreateVoucherDTO {
    discount: number; // min: 0, max: 100
    voucherCode?: string; // optional, min: 5, max: 10
    description: string;
    startDate: string;
    expirationDate: string;
    limitSlot: number;
    isLimitedUsage: boolean;
    slotUsage: number; // default: 0
}