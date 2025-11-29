export interface Wish {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    createdAt: string;
}

export interface WishFormData {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}

export type SortByDate = 'newest' | 'oldest';
export type SortByPrice = 'high-to-low' | 'low-to-high';