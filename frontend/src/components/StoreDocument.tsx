import { useState } from "react";
import { ethers, keccak256 } from "ethers";
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react' // Import ReOwn AppKit Wallet Hook
import { toast } from "react-toastify";
import { MerkleTree } from "merkletreejs";

const StoreDocument = () => {
    const account = useAppKitAccount(); // Access ReOwn wallet
    const { walletProvider } = useAppKitProvider('eip155')
    const [docHash, setDocHash] = useState("");
    const [merkleRoot, setMerkleRoot] = useState("");
    const [keyShares, setKeyShares] = useState<string[]>([]);
    const [partialSignatures, setPartialSignatures] = useState<string[]>([]);
    const [tssSignature, setTssSignature] = useState("");


    // Step 1: Generate TSS Key Shares
    const generateKeyShares = () => {
        if (!docHash) {
            toast.error("⚠️ Enter document hash before generating key shares.");
            return;
        }

        let shares: string[] = [
            keccak256(ethers.toUtf8Bytes("Government")),
            keccak256(ethers.toUtf8Bytes("Citizen")),
        ];
        /* for (let i = 0; i < 3; i++) {
            shares.push(CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex));
        } */

        setKeyShares(shares);
        toast.success("✅ Key Shares Generated!");
    };

    // Step 2: Generate Partial Signatures
    const generatePartialSignatures = () => {
        if (keyShares.length === 0) {
            toast.error("⚠️ Generate key shares first.");
            return;
        }

        let signatures: string[] = keyShares.map(share =>
            ethers.keccak256(ethers.toUtf8Bytes(share + docHash))
        );

        setPartialSignatures(signatures);
        toast.success("✅ Partial Signatures Generated!");
    };

    // Step 3: Aggregate into a TSS Signature
    const generateTSSSignature = () => {
        if (partialSignatures.length === 0) {
            toast.error("⚠️ Generate partial signatures first.");
            return;
        }

        const aggregatedSignature = ethers.keccak256(
            ethers.toUtf8Bytes(partialSignatures.join(""))
        );
        setTssSignature(aggregatedSignature);
        toast.success("✅ Final Signature Generated!");
    };

    // Step 4: Generate Merkle Root
    const generateMerkleRoot = () => {
        if (!docHash) {
            toast.error("⚠️ Enter document hash before generating Merkle root.");
            return;
        }

        const attestors = keyShares;
        const leaves = attestors.map(addr => keccak256(ethers.toUtf8Bytes(addr)));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const root = "0x" + tree.getRoot().toString("hex");
        setMerkleRoot(root);
        toast.success("✅ Merkle Root Generated!");
    };

    const storeDocument = async () => {
        if (!account.isConnected) {
            toast.error("Please connect your wallet first.");
            return;
        }

        if (!docHash || !tssSignature) {
            toast.error("Document hash or signautre is not available.");
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
            const tx = await contract.storeDocument(docHash, tssSignature, merkleRoot || "0x0");
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
            <button onClick={generateKeyShares} 
                    className="action-button-list">Generate Key Shares</button>
                {keyShares.length > 0 && (
                    <div className="result-box">
                        <h4>🔹 Key Shares</h4>
                        {keyShares.map((share, index) => (
                            <p key={index}>{share}</p>
                        ))}
                    </div>
                )}
            <button onClick={generatePartialSignatures} className="action-button-list">✍ Generate Partial Signatures</button>
                {partialSignatures.length > 0 && (
                    <div className="result-box">
                        <h4>🔹 Partial Signatures</h4>
                        {partialSignatures.map((sig, index) => (
                            <p key={index}>{sig}</p>
                        ))}
                    </div>
                )}
            <button onClick={generateTSSSignature} className="action-button-list">🔗 Aggregate into TSS Signature</button>
                {tssSignature && (
                    <div className="result-box">
                        <h4>✅ Final Signature</h4>
                        <p>{tssSignature}</p>
                    </div>
                )}
            <button onClick={generateMerkleRoot} className="btn">🌳 Generate Merkle Root</button>
                {merkleRoot && (
                    <div className="result-box">
                        <h4>🌳 Merkle Root</h4>
                        <p>{merkleRoot}</p>
                    </div>
                )}
            <button onClick={storeDocument} className="action-button-list">Store Document</button>
        </div>
    </div>
    );
};

export default StoreDocument;