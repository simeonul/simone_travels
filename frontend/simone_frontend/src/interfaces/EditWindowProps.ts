import {Destination} from "./Destination";

export interface EditWindowProps {
    isOpen: boolean;
    onClose: () => void;
    destination: Destination;
    children?: React.ReactNode;
    onUpdateSuccess: () => void;
}