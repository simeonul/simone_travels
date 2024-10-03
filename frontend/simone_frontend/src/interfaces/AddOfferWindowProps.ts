export interface AddOfferWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSuccess: () => void;
    children?: React.ReactNode;

}