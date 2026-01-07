export interface Category {
    id: string;
    title: string;
    description: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    parent: string | Category | null;
    children: any[];
    addedBy: {
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
}