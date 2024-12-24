import Modal from "@/Components/Modal";

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
            <div className="mt-2 max-h-[85vh] overflow-y-auto">
                {modalContent}
            </div>
        </Modal>
    );
}
