import QRCode from "qrcode";

export async function generateQrDataUrl(profileUrl: string): Promise<string> {
  return QRCode.toDataURL(profileUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 320,
    color: {
      dark: "#0F172A", // Slate 900
      light: "#FFFFFF",
    },
  });
}

export async function generateQrSvg(profileUrl: string): Promise<string> {
  return QRCode.toString(profileUrl, {
    type: "svg",
    margin: 1,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });
}