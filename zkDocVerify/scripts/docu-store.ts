import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider("https://sepolia.era.zksync.dev");
const privateKey = process.env.WALLET_PRIVATE_KEY || "";
const signer = new ethers.Wallet(privateKey, provider);
const contractAddress: string = "0x3c3eFdD3DaB60AcCb50d90dD6CFdc16F57949071";
const abi: string[] = [
    "function storeDocument(bytes32, bytes, bytes32) public"
];

async function storeDocument(
    docHash: string, 
    signature: string, 
    merkleRoot: string
): Promise<void> {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.storeDocument(docHash, signature, merkleRoot);
    await tx.wait();
    console.log("Stored on zkSync:", tx.hash);
}

// Example usage
const documentHash: string = "0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb";
const tssSignature: string = "0x4b688df40bcedbe641ddb52926c971a0f1ef8c9fa9c40d9da3d3bf5edf6e25d26cbfcba3af4a5068f73233037e833b517382ce7767e4042955c9f6fb6633f67b1b";
const merkleRoot: string = "0x5931b4ed56ace4c46b68524cb5bcbf4195f1bbaacbe5228fbd090546c88dd229"; // Optional

storeDocument(documentHash, tssSignature, merkleRoot)
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });

// Docu stored: 0xa59c02281abf66191aa823f38616fd19fb48333ce291c75a70fd70a10ddce32e