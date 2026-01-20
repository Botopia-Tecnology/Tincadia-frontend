export interface LandingConfigItem {
    key: string;
    value: string;
    description: string;
    updatedAt: string;
}

export interface Testimonial {
    id: string;
    authorName: string;
    authorRole: string;
    quote: string;
    rating: number;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}
