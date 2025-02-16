import { useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";

const QRCode = ({ value }: { value: string }) => {
    const qrRef = useRef(null);
    const qrCode = new QRCodeStyling({
        width: 512,
        height: 512,
        data: value,
        dotsOptions: { color: "#000", type: "rounded" },
    });

    useEffect(() => {
        if (qrRef.current) {
            qrCode.append(qrRef.current);
        }
    }, []);

    return <div ref={qrRef} />;
};

export default QRCode;