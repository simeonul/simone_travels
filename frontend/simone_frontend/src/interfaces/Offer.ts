export interface Offer {
    discount_percentage: number;
    id?: string;
    title: string;
    valid_from: string;
    valid_to: string;
    destination_id?: string;
}