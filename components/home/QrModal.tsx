
"use client";

import React, { useState } from "react";
import { X, Copy, Download, Share2, Check } from "lucide-react";
import { QrVisual } from "./qr-visual";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
}

export function QrModal({
  isOpen,
  onClose,
  profileId,
}: QrModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${profileId}`
      : `https://xrovia.com/${profileId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Xrovia Public Profile - ${profileId}`,
          url: profileUrl,
        });
      } catch {
        // User cancelled share window
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownload = () => {
    const svgElement = document.getElementById("modal-qr-code");
    if (!svgElement) return;

    // Serialize SVG XML data
    const xml = new XMLSerializer().serializeToString(svgElement);

    const svgBlob = new Blob([xml], {
      type: "image/svg+xml;charset=utf-8",
    });

    // Create a temporary object URL
    const blobUrl = URL.createObjectURL(svgBlob);

    // Render SVG into an Image and draw to Canvas
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 3;

      canvas.width = 300 * scale;
      canvas.height = 300 * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(blobUrl);
        return;
      }

      // White background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert to PNG
      const pngUrl = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `XROVIA-${profileId}-QR.png`;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Release the temporary object URL
      URL.revokeObjectURL(blobUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      alert("Could not generate the QR code image.");
    };

    img.src = blobUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Share Profile
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            Professional ID: {profileId}
          </h3>

          {/* QR Container */}
          <div className="mx-auto my-6 flex h-48 w-48 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-inner">
            <QrVisual id="modal-qr-code" className="h-full w-full" />
          </div>

          {/* Profile Link */}
          <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <span className="truncate text-xs font-medium text-slate-600">
              {profileUrl}
            </span>

            <button
              onClick={handleCopyLink}
              className="ml-2 inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              <Download className="h-4 w-4 text-blue-700" />
              Download
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}