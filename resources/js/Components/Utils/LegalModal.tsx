import Modal from "@/Components/Modal";
import { IoCloseOutline } from "react-icons/io5";

interface LegalModalProps {
    onClose: () => void;
    show: boolean;
    modalContent: JSX.Element;
}

export default function LegalModal({
    onClose,
    show,
    modalContent,
}: LegalModalProps) {
    return (
        <Modal show={show} onClose={onClose}>
            <div className="relative">
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <IoCloseOutline className="h-6 w-6 text-gray-500" />
                </button>
                <div className="mt-2 max-h-[85vh] overflow-y-auto pt-8">
                    {modalContent}
                </div>
            </div>
        </Modal>
    );
}
