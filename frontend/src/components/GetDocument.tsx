import { useState } from "react";
import { ethers } from "ethers";
import { useAppKitProvider } from '@reown/appkit/react'
import { toast } from "react-toastify";

const GetDocument = () => {
    const { walletProvider } = useAppKitProvider('eip155');
    const [docHash, setDocHash] = useState("");
    const [documentData, setDocumentData] = useState<{
        signature: string;
        merkleRoot: string;
        issuer: string;
        timestamp: string;
    } | null>(null);

    const getDocument = async () => {
        if (!walletProvider) {
            toast.error("⚠️ Please connect your wallet first.");
            return;
        }

        if (!docHash) {
            toast.error("⚠️ Enter a valid document hash.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                ["function getDocument(bytes32) public view returns (bytes32, bytes, bytes32, address, uint256)"],
                provider
            );

            // Ensure docHash is a valid bytes32 format
            if (!ethers.isHexString(docHash, 32)) {
                toast.error("❌ Invalid document hash format.");
                return;
            }

            const result = await contract.getDocument(docHash);

            if (result[0] === ethers.ZeroHash) {
                toast.error("❌ Document not found.");
                return;
            }

            setDocumentData({
                signature: ethers.hexlify(result[1]),
                merkleRoot: result[2],
                issuer: result[3],
                timestamp: new Date(Number(result[4]) * 1000).toLocaleString(),
            });

            toast.success("✅ Document data retrieved!");
        } catch (error) {
            toast.error("❌ Error fetching document.");
            console.error("GetDocument Error:", error);
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-title">📄 Retrieve Stored Document</h2>
            <div className="appkit-buttons-container">
                <input
                    type="text"
                    placeholder="Document Hash (Keccak256)"
                    value={docHash}
                    onChange={(e) => setDocHash(e.target.value)}
                    className="input-container-content"
                />
                <button onClick={getDocument} className="action-button-list">Get Document</button>
            </div>

            {documentData && (
                <div className="result-box">
                    <h3>📜 Document Details</h3>
                    <p><strong>🔑 TSS Signature:</strong> {documentData.signature}</p>
                    <p><strong>🌳 Merkle Root:</strong> {documentData.merkleRoot}</p>
                    <p><strong>👤 Issuer:</strong> {documentData.issuer}</p>
                    <p><strong>⏳ Timestamp:</strong> {documentData.timestamp}</p>
                </div>
            )}
        </div>
    );
};

export default GetDocument;