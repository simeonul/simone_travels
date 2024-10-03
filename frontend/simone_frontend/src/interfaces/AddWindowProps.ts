export interface AddWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSuccess: () => void;
    children?: React.ReactNode;

}