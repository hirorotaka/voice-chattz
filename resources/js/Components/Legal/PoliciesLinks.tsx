import { useState } from "react";
import LegalModal from "../Utils/LegalModal";
import LegalTerms from "./LegalTerms";

function LegalLinks() {
    const [showLegalModal, setShowLegalModal] = useState(false);
    const [legalContent, setLegalContent] = useState<JSX.Element>(<></>);

    const handleLegalOpenModal = (content: JSX.Element) => {
        setLegalContent(content);
        setShowLegalModal(true);
    };

    const handleLegalCloseModal = () => {
        setShowLegalModal(false);
    };
    return (
        <>
            <div className="mt-8 flex flex-col items-center justify-center">
                <div
                    onClick={() => handleLegalOpenModal(<LegalTerms />)}
                    className="text-center text-base text-gray-400"
                >
                    利用規約
                </div>
                <div
                    onClick={() => handleLegalOpenModal(LegalTerms())}
                    className="mt-1 text-center text-base text-gray-400"
                >
                    プライバシーポリシー
                </div>
            </div>

            <LegalModal
                show={showLegalModal}
                onClose={handleLegalCloseModal}
                modalContent={legalContent}
            />
        </>
    );
}

export default LegalLinks;
