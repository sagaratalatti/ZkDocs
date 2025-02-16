import { useState } from "react";
import { ethers } from "ethers";
import { useAppKitProvider } from '@reown/appkit/react'  // Import ReOwn AppKit Wallet Hook
import { toast } from "react-toastify";

const VerifyDocument = () => {
    const { walletProvider } = useAppKitProvider('eip155') // Access ReOwn wallet provider
    const [docHash, setDocHash] = useState("");
    const [signature, setSignature] = useState("");
    const [verificationResult, setVerificationResult] = useState("");

    const verifyDocument = async () => {
        if (!walletProvider) {
            toast.error("Please connect your wallet first.");
            return;
        }

        if (!docHash || !signature) {
            toast.error("Please enter document hash and signature.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                ["function verifyDocument(bytes32, bytes) public view returns (bool)"],
                provider
            );

            // Ensure signature is in bytes format
            const signatureBytes = ethers.getBytes(signature);
            
            // Call the smart contract verifyDocument function
            const isValid = await contract.verifyDocument(docHash, signatureBytes);

            setVerificationResult(isValid ? "✅ Document is valid!" : "❌ Document verification failed!");
            toast.success(isValid ? "✅ Valid Document!" : "❌ Invalid Document!");
        } catch (error) {
            toast.error("❌ Error verifying document.");
            console.error(error);
        }
    };

    return (
        <div className="page-container">
        <h2 className="page-title">🔍 Verify Document</h2>
        <div className="appkit-buttons-container">
            <input
                type="text"
                placeholder="Document Hash"
                onChange={(e) => setDocHash(e.target.value)}
                className="input-container-content"
            />
            <input
                type="text"
                placeholder="Signature"
                onChange={(e) => setSignature(e.target.value)}
                className="input-container-content"
            />
            <button onClick={verifyDocument} className="action-button-list">Verify Document</button>
            <p className="warning">{verificationResult}</p>
        </div>
    </div>
    );
};

export default VerifyDocument;