import { useState } from "react";
import { ethers } from "ethers";
import { useAppKitProvider } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "ethers";

const VerifyDocument = () => {
    const { walletProvider } = useAppKitProvider('eip155');
    const [docHash, setDocHash] = useState("");
    const [signature, setSignature] = useState("");
    const [attestorAddress, setAttestorAddress] = useState("");
    const [proof, setProof] = useState<string[]>([]);
    const [verificationResult, setVerificationResult] = useState("");

    const verifyDocument = async () => {
        if (!walletProvider) {
            toast.error("⚠️ Please connect your wallet first.");
            return;
        }

        if (!docHash || !signature) {
            toast.error("⚠️ Enter document hash and signature.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                [
                    "function getDocument(bytes32) public view returns (bytes32, bytes, bytes32, address, uint256)",
                    "function verifyDocument(bytes32, bytes) public view returns (bool)",
                    "function verifyMerkleProof(bytes32, bytes32[]) public view returns (bool)"
                ],
                signer
            );

            if (!ethers.isHexString(docHash, 32)) {
                toast.error("❌ Invalid document hash format.");
                return;
            }

            console.log("🔍 Fetching stored document for verification...");

            const storedData = await contract.getDocument(docHash);
            if (storedData[0] === ethers.ZeroHash) {
                toast.error("❌ Document not found on-chain.");
                setVerificationResult("❌ Document not found!");
                return;
            }

            const storedSignature = ethers.hexlify(storedData[1]);
            const storedMerkleRoot = storedData[2];

            const signatureBytes = ethers.getBytes(signature);

            console.log("🔍 Comparing Signatures:");
            console.log("Stored Signature:", storedSignature);
            console.log("Provided Signature:", signature);

            const isValidSignature = await contract.verifyDocument(docHash, signatureBytes);

            if (!isValidSignature) {
                setVerificationResult("❌ Document signature verification failed!");
                toast.error("❌ Signature does not match!");
                return;
            }

            // If attestor address is provided, generate proof
            if (attestorAddress) {
                const attestors =  [keccak256(ethers.toUtf8Bytes("Government")),
                keccak256(ethers.toUtf8Bytes("Citizen"))]
                const leaves = attestors.map(addr => keccak256(ethers.toUtf8Bytes(addr)));
                const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

                const leaf = keccak256(attestorAddress);
                const merkleProof = tree.getProof(leaf).map(proofNode => "0x" + proofNode.data.toString("hex"));

                setProof(merkleProof);
                console.log("Generated Merkle Proof:", merkleProof);
                console.log("Stored Merkle Root:", storedMerkleRoot);

                const isValidMerkleProof = await contract.verifyMerkleProof(leaf, merkleProof);

                if (!isValidMerkleProof) {
                    setVerificationResult("❌ Attestor is NOT part of the Merkle Tree!");
                    toast.error("❌ Merkle Proof verification failed!");
                    return;
                }

                toast.success("✅ Merkle Proof verified!");
            }

            setVerificationResult("✅ Document is fully verified!");
            toast.success("✅ Document and Merkle Proof verified!");

        } catch (error) {
            toast.error("❌ Error verifying document.");
            console.error("Verification Error:", error);
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-title">🔍 Verify Document</h2>
            <div className="appkit-buttons-container">
                <input
                    type="text"
                    placeholder="Document Hash (Keccak256)"
                    value={docHash}
                    onChange={(e) => setDocHash(e.target.value)}
                    className="input-container-content"
                />
                <input
                    type="text"
                    placeholder="Signature"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="input-container-content"
                />
                <input
                    type="text"
                    placeholder="Attestor Address (Optional)"
                    value={attestorAddress}
                    onChange={(e) => setAttestorAddress(e.target.value)}
                    className="input-container-content"
                />
                <button onClick={verifyDocument} className="action-button-list">Verify Document</button>
                
                {proof.length > 0 && (
                    <div className="result-box">
                        <h3>🌳 Merkle Proof</h3>
                        <pre>{JSON.stringify(proof, null, 2)}</pre>
                    </div>
                )}

                <p className="warning">{verificationResult}</p>
            </div>
        </div>
    );
};

export default VerifyDocument;