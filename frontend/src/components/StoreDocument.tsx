import { useState } from "react";
import { ethers } from "ethers";
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react' // Import ReOwn AppKit Wallet Hook
import { toast } from "react-toastify";

const StoreDocument = () => {
    const account = useAppKitAccount(); // Access ReOwn wallet
    const { walletProvider } = useAppKitProvider('eip155')
    const [docHash, setDocHash] = useState("");
    const [signature, setSignature] = useState("");
    const [merkleRoot, setMerkleRoot] = useState("");

    const storeDocument = async () => {
        if (!account.isConnected) {
            toast.error("Please connect your wallet first.");
            return;
        }

        if (!docHash || !signature) {
            toast.error("Please enter document hash and signature.");
            return;
        }

        try {
            // Create a signer from the connected wallet
            const provider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                ["function storeDocument(bytes32, bytes, bytes32) public"],
                signer
            );

            // Send transaction
            const tx = await contract.storeDocument(docHash, signature, merkleRoot || "0x0");
            await tx.wait();
            toast.success("✅ Document stored successfully!");
        } catch (error) {
            toast.error("❌ Error storing document.");
            console.error(error);
        }
    };

    return (
        <div className="page-container">
        <h2 className="page-title">📜 Store Document</h2>
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
            <input
                type="text"
                placeholder="Merkle Root (Optional)"
                onChange={(e) => setMerkleRoot(e.target.value)}
                className="input-container-content"
            />
            <button onClick={storeDocument} className="action-button-list">Store Document</button>
        </div>
    </div>
    );
};

export default StoreDocument;