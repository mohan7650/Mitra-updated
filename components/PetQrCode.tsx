import { QRCodeSVG } from "qrcode.react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function petSafetyUrl(qrCodeId: string) {
  return `${APP_URL}/pet-id/${qrCodeId}`;
}

export default function PetQrCode({
  qrCodeId,
  size = 72,
  className = "",
}: {
  qrCodeId: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`grid place-items-center rounded-md bg-white p-1 ${className}`} style={{ width: size, height: size }}>
      <QRCodeSVG value={petSafetyUrl(qrCodeId)} size={size - 8} level="M" />
    </div>
  );
}
