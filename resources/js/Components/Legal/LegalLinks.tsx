import { useState } from "react";
import LegalModal from "../Utils/LegalModal";
import LegalTerms from "./LegalTerms";
import LegalPolicies from "./LegalPolicies";

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
            <div className="flex items-center justify-center">
                <div
                    onClick={() => handleLegalOpenModal(<LegalTerms />)}
                    className="text-center text-base text-slate-300 hover:text-slate-100 flex items-center gap-1 underline-offset-2 hover:underline transition-colors"
                >
                    利用規約
                </div>
                <div
                    onClick={() => handleLegalOpenModal(<LegalPolicies />)}
                    className="ml-4 text-center text-base text-slate-300 hover:text-slate-100 flex items-center gap-1 underline-offset-2 hover:underline transition-colors"
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
