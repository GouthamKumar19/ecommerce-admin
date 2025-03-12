export interface Category {
    id: string;
    category: string;
    subcategory: string;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
    [key: string]: string | number | boolean;
}