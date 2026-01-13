import type { Category } from "./CategoryModel";
import type { User } from "./UserModel";


export interface Product {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    cat: Category;
    addedBy: User;
}