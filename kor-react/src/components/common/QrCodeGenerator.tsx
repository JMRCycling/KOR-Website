import React, { useState, useEffect } from 'react';
import './QrCodeGenerator.css';

interface QrCodeGeneratorProps {
  shopCode?: string;
  shopName?: string;
  size?: number;
  className?: string;
  onError?: (error: string) => void;
  genericMode?: boolean; // For inactive users - shows generic app download
  genericUrl?: string; // Custom URL for generic mode
}

const DownloadIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path
      d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M4 15.5h12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PdfIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path
      d="M6 2.5h5.5L15 6v11a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5v-14a.5.5 0 01.5-.5z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M11.5 2.5V6H15" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({
  shopCode,
  shopName,
  size = 200,
  className = '',
  onError,
  genericMode = false,
  genericUrl = 'https://jmrcycling.com/app_auth.html'
}) => {
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);


  // Download QR code image
  const downloadQrCode = async () => {
    if (!qrImageUrl) return;

    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${shopName || shopCode}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      console.log('✅ [QrCodeGenerator] QR code downloaded successfully');
    } catch (err) {
      const errorMsg = 'Failed to download QR code';
      console.error('❌ [QrCodeGenerator] Download error:', err);
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  // Export the QR poster as a downloaded PDF file, rather than routing
  // through the OS print dialog — a real .pdf on disk is something the shop
  // can open directly in Illustrator/Acrobat/Canva and edit before they
  // print or repost it themselves. jsPDF text is drawn as real vector text
  // (not a rasterized image), so it stays selectable/editable.
  const exportPdf = async () => {
    if (!qrImageUrl) return;

    setIsExporting(true);
    setError('');

    try {
      const { default: jsPDF } = await import('jspdf');

      // Reuse the same fetch-to-blob approach as downloadQrCode, then hand
      // jsPDF a data URL — addImage needs actual image data, not a URL.
      const res = await fetch(qrImageUrl);
      const blob = await res.blob();
      const qrDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const pageW = 360; // 5in poster at 72pt/in — small enough to reprint at a copy shop, easy to resize
      const pageH = 504; // 7in
      const doc = new jsPDF({ unit: 'pt', format: [pageW, pageH] });

      const navy: [number, number, number] = [15, 26, 38];
      const mint: [number, number, number] = [133, 255, 199];
      const coolGray: [number, number, number] = [200, 212, 222];
      const white: [number, number, number] = [255, 255, 255];
      const centerX = pageW / 2;

      doc.setFillColor(...navy);
      doc.rect(0, 0, pageW, pageH, 'F');

      let y = 54;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...mint);
      doc.text('K O R', centerX, y, { align: 'center' });
      y += 10;
      doc.setFillColor(...mint);
      doc.rect(centerX - 18, y, 36, 2, 'F');
      y += 36;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(32);
      doc.setTextColor(...white);
      doc.text('SCAN TO', centerX, y, { align: 'center' });
      y += 36;
      doc.setTextColor(...mint);
      doc.text('GET ROLLING', centerX, y, { align: 'center' });
      y += 28;

      const subhead = genericMode
        ? 'Your bike, tracked automatically.'
        : `Get set up at ${shopName || 'your shop'}.`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(...coolGray);
      doc.text(subhead, centerX, y, { align: 'center' });
      y += 30;

      const plateSize = 180;
      const plateX = centerX - plateSize / 2;
      doc.setDrawColor(...mint);
      doc.setLineWidth(2);
      doc.setFillColor(...white);
      doc.roundedRect(plateX, y, plateSize, plateSize, 6, 6, 'FD');
      const inset = 16;
      doc.addImage(qrDataUrl, 'PNG', plateX + inset, y + inset, plateSize - inset * 2, plateSize - inset * 2);
      y += plateSize + 24;

      if (!genericMode) {
        doc.setFont('courier', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...mint);
        doc.text(`SHOP CODE · ${shopCode}`, centerX, y, { align: 'center' });
      }

      const footerY = pageH - 48;
      doc.setDrawColor(30, 45, 61);
      doc.setLineWidth(1);
      doc.line(centerX - 80, footerY - 18, centerX + 80, footerY - 18);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(...coolGray);
      doc.text('Built by cyclists, for cyclists.', centerX, footerY, { align: 'center' });

      const fileSlug = (shopName || shopCode || 'kor').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      doc.save(`${fileSlug}-qr-poster.pdf`);

      console.log('📄 [QrCodeGenerator] PDF exported successfully');
    } catch (err) {
      const errorMsg = 'Failed to export PDF';
      console.error('❌ [QrCodeGenerator] PDF export error:', err);
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsExporting(false);
    }
  };

  // Generate QR code when shopCode or genericMode changes
  useEffect(() => {
    if (!genericMode && !shopCode) {
      setError('Shop code is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let targetUrl: string;

      if (genericMode) {
        // Generic mode for inactive users
        targetUrl = genericUrl;
      } else {
        // Normal shop-specific mode for active users
        targetUrl = `https://jmrcycling.com:3001/qr/onboard/${shopCode}`;
      }

      const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(targetUrl)}&size=${size}`;
      setQrImageUrl(qrUrl);

      console.log('📱 [QrCodeGenerator] QR code generated:', {
        mode: genericMode ? 'generic' : 'shop-specific',
        shopCode: genericMode ? 'N/A' : shopCode,
        shopName: genericMode ? 'N/A' : shopName,
        targetUrl,
        qrUrl
      });
    } catch (err) {
      const errorMsg = 'Failed to generate QR code';
      console.error('❌ [QrCodeGenerator] Generation error:', err);
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [shopCode, size, shopName, genericMode, genericUrl, onError]);

  if (isLoading) {
    return (
      <div className={`qr-generator qr-generator__loading ${className}`}>
        <div className="qr-generator__spinner" />
        <p>Generating QR code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`qr-generator qr-generator__error ${className}`}>
        <p>{error}</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Shop Code: <code>{shopCode}</code>
        </p>
      </div>
    );
  }

  return (
    <div className={`qr-generator ${className}`}>
      <div className="qr-generator__plate">
        {qrImageUrl ? (
          <img
            src={qrImageUrl}
            alt={`QR Code for ${shopName || shopCode}`}
            width={size}
            height={size}
            style={{ width: `${size}px`, height: `${size}px`, maxWidth: '100%' }}
            onLoad={() => console.log('✅ [QrCodeGenerator] QR code image loaded')}
            onError={(e) => {
              const errorMsg = 'Failed to load QR code image';
              console.error('❌ [QrCodeGenerator] Image load error:', e);
              setError(errorMsg);
              onError?.(errorMsg);
            }}
          />
        ) : null}
      </div>

      <div className="qr-generator__actions">
        <button className="qr-btn qr-btn--secondary" onClick={downloadQrCode}>
          <DownloadIcon />
          Download
        </button>
        <button className="qr-btn qr-btn--primary" onClick={exportPdf} disabled={isExporting}>
          <PdfIcon />
          {isExporting ? 'Exporting…' : 'Export PDF'}
        </button>
      </div>

      <div className="qr-generator__meta">
        {genericMode ? (
          <>
            <div className="qr-meta-row">
              <span className="qr-meta-label">Mode</span>
              <span className="qr-meta-value">Generic App Access</span>
            </div>
            <div className="qr-meta-row">
              <span className="qr-meta-label">Target URL</span>
              <span className="qr-meta-value">{genericUrl}</span>
            </div>
          </>
        ) : (
          <>
            <div className="qr-meta-row">
              <span className="qr-meta-label">Shop Code</span>
              <span className="qr-meta-value">{shopCode}</span>
            </div>
            <div className="qr-meta-row">
              <span className="qr-meta-label">Onboarding URL</span>
              <span className="qr-meta-value">https://jmrcycling.com:3001/qr/onboard/{shopCode}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QrCodeGenerator;
