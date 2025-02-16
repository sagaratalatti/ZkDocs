import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider("https://sepolia.era.zksync.dev");
const privateKey = process.env.WALLET_PRIVATE_KEY || "";
const signer = new ethers.Wallet(privateKey, provider);
const contractAddress: string = "0x3c3eFdD3DaB60AcCb50d90dD6CFdc16F57949071";

const abi: string[] = [
    "function verifyDocument(bytes32, bytes) public view returns (bool)",
    "function getDocument(bytes32) public view returns (bytes32, bytes, bytes32, address, uint256)"
];

async function verifyDocument(docHash: string, signature: string): Promise<void> {
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
        // Convert signature into bytes (hex format)
        const signatureBytes = ethers.getBytes(signature);
        // Call the smart contract verifyDocument function
        const isValid = await contract.verifyDocument(docHash, signatureBytes);

        console.log(isValid ? "✅ Document is valid!" : "❌ Document verification failed!");
    } catch (error) {
        console.error("Error verifying document:", error);
    }
}

// Example usage
const documentHash = "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb";
const tssSignature = "0x4b688df40bcedbe641ddb52926c971a0f1ef8c9fa9c40d9da3d3bf5edf6e25d26cbfcba3af4a5068f73233037e833b517382ce7767e4042955c9f6fb6633f67b1b";

verifyDocument(documentHash, tssSignature);