import type { Product } from "./ProductModel";
import type { User } from "./UserModel";


export interface CartItem {
    id: string;
    qty: number;
    totalPrice: string | number;
    addedBy: User;
    prod: Product;
    createdAt: string;
    updatedAt: string;
}