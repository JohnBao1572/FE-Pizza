export interface AddressModel {
    id: string;
    street: string;
    ward: string;
    district: string;
    province: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    addedBy?: {
        id: string;
        email: string;
    };
}