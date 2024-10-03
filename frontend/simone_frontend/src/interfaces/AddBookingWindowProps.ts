import {Offer} from "./Offer";
import {Destination} from "./Destination";

export interface AddBookingWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSuccess: () => void;
    startDate: Date;
    endDate: Date;
    destination: Destination | null;
    offer?: Offer | null;
    children?: React.ReactNode;

}