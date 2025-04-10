export type VoucherResponse = {
    discount: number;
    voucherCode: string;
    description: string;
    startDate: string;
    expirationDate: string;
    limitSlot: number;
    remainingTime: number | null;
};