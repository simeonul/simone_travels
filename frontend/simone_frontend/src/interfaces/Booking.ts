export interface Booking {
    id?: string;
    title: string;
    creation_date: Date;
    start_date: Date;
    end_date: Date;
    total_cost: number;
    email: string;
    destination_id?: string;
}