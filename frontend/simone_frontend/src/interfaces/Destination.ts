import {Description} from "./Description";
import {Offer} from "./Offer";
import {Booking} from "./Booking";

export interface Destination {
    capacity: number;
    description: Description;
    id: string;
    location: string;
    nightly_rate: number;
    offers: Offer[];
    title: string;
    bookings: Booking[];
}