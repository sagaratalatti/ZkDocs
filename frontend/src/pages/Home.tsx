import CreateDocHash from "@/components/GenerateDocHash"
import StoreDocument from "@/components/StoreDocument";
import GetDocument from "@/components/GetDocument";
import VerifyDocument from "@/components/VerifyDocument";
import QRCode from "@/components/QRcode";
import { useState } from "react";

export default function Home() {
    const [docHash, setDocHash] = useState("");

    return (
        <div>
            <h1>zkSync Document Verifier</h1>
                <CreateDocHash onHashGenerated={setDocHash} />
                <StoreDocument />
                <GetDocument />
                <VerifyDocument />
            <div className="page-container">
                <h2>QR Code for Verification</h2>
                <div className="appkit-buttons-container">
                <input type="text" 
                       placeholder="Enter Document Hash" 
                       onChange={(e) => setDocHash(e.target.value)}
                       className="input-container-content" />
                       {docHash && <QRCode value={docHash} />}
                </div>
            </div>
        </div>
    );
}