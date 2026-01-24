import type { AddressModel } from "./AddressModel";
import type { Discount } from "./DiscountModel";
import type { User } from "./UserModel";



export interface BillModel {
    id: string;
    TotalPrices: number | string;
    status: string;
    createdAt: string;
    updatedAt: string;
    address: AddressModel;
    addedBy: User;
    cart: {
        id: string;
        qty: number;
        totalPrice: string;
        createdAt: string;
        updatedAt: string;
    }[];
    discount?: Discount;
}