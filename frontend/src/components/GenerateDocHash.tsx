import { useState } from "react";
import { ethers } from "ethers";

const GenerateDocHash = ({ onHashGenerated }: { onHashGenerated: (hash: string) => void }) => {
    const [aadharNumber, setAadharNumber] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [docHash, setDocHash] = useState("");

    const generateHash = () => {
        if (!aadharNumber || !documentNumber) {
            alert("Please enter both Aadhar and Document Number.");
            return;
        }

        const inputString = `${aadharNumber}-${documentNumber}`;
        const hash = ethers.keccak256(ethers.toUtf8Bytes(inputString));
        setDocHash(hash);
        onHashGenerated(hash);
    };

    return (
        <div className="page-container">
            <h3 className="hash-title">🔑 Generate Document Hash</h3>
            <div className="appkit-buttons-container">
                <label>Aadhar Number</label>
                <input type="text" 
                       value={aadharNumber}
                       className="input-container-content"
                       onChange={(e) => setAadharNumber(e.target.value)} />
            </div>
            <div className="appkit-buttons-container">
                <label>Document Number</label>
                <input type="text"
                       value={documentNumber}
                       className="input-container-content"
                       onChange={(e) => setDocumentNumber(e.target.value)} />
            </div>
            <button onClick={generateHash} className="action-button-list">Generate Hash</button>
            {docHash && <p className="code-container-title">📜 Document Hash: {docHash}</p>}
        </div>
    );
};

export default GenerateDocHash;