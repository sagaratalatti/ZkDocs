import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";

const addresses = [
    "0xSigner1",
    "0xSigner2",
    "0xSigner3"
].map((addr) => ethers.keccak256(ethers.toUtf8Bytes(addr))); // Using Ethers v6 Keccak256

const merkleTree = new MerkleTree(addresses, ethers.keccak256, { sortPairs: true });
const merkleRoot = merkleTree.getRoot().toString("hex");

console.log("Merkle Root:", merkleRoot);

// Generate document hash using ethers v6
const document = "Confidential Document Content";
const documentHash = ethers.keccak256(ethers.toUtf8Bytes(document)); // Using Ethers v6 Keccak256
console.log("Document Hash:", documentHash);

// Generate Merkle Proof for a signer
const signerAddress = "0xSigner1";
const signerHash = ethers.keccak256(ethers.toUtf8Bytes(signerAddress));
const proof = merkleTree.getProof(signerHash).map((x) => x.data.toString("hex"));

console.log("Merkle Proof:", proof);