import type { User } from "./UserModel";

export interface Discount {
    id: number;
    title: string;
    description: string;
    code: string;
    image: string[]; // array image
    startAt: string;
    endAt: string;
    discountedPrice: number;
    minOrderValue: number;
    quantity: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    addedBy: User;
}