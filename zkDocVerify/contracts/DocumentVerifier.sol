// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DocumentVerification {
    struct Document {
        bytes32 hash; // Keccak256 hash of the document
        bytes signature; // Threshold signature from TSS
        bytes32 merkleRoot; // Merkle root for multi-party attestations
        address issuer; // Address of the entity that stored the document
        uint256 timestamp; // Timestamp of document registration
    }

    mapping(bytes32 => Document) public verifiedDocuments;

    event DocumentSigned(
        bytes32 indexed hash,
        bytes signature,
        bytes32 merkleRoot,
        address issuer,
        uint256 timestamp
    );

    /// @notice Stores a document with its TSS signature and optional Merkle root for attestations
    function storeDocument(
        bytes32 _hash,
        bytes memory _signature,
        bytes32 _merkleRoot
    ) public {
        require(verifiedDocuments[_hash].hash == 0, "Document already exists");

        verifiedDocuments[_hash] = Document({
            hash: _hash,
            signature: _signature,
            merkleRoot: _merkleRoot,
            issuer: msg.sender,
            timestamp: block.timestamp
        });

        emit DocumentSigned(
            _hash,
            _signature,
            _merkleRoot,
            msg.sender,
            block.timestamp
        );
    }

    /// @notice Retrieves document details
    function getDocument(
        bytes32 _hash
    ) public view returns (bytes32, bytes memory, bytes32, address, uint256) {
        require(verifiedDocuments[_hash].hash != 0, "Document not found");
        Document memory doc = verifiedDocuments[_hash];
        return (
            doc.hash,
            doc.signature,
            doc.merkleRoot,
            doc.issuer,
            doc.timestamp
        );
    }

    function verifyDocument(
        bytes32 _hash,
        bytes memory _signature
    ) public view returns (bool) {
        Document memory doc = verifiedDocuments[_hash];
        require(doc.hash != 0, "Document not found");

        // Debug: Print the expected and received hash
        bytes32 expectedHash = keccak256(doc.signature);
        bytes32 receivedHash = keccak256(_signature);

        require(expectedHash == receivedHash, "Signature mismatch");

        return true;
    }
}
