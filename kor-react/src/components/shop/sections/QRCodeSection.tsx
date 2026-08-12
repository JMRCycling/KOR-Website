import React from 'react';
import QrCodeGenerator from '../../common/QrCodeGenerator';
import { DashboardSectionProps } from '../types';
import './QRCodeSection.css';

// Extended props to allow plan-specific customization
interface QRCodeSectionProps extends DashboardSectionProps {
  customerLabel?: string;     // "Customer" or "Family Member"
  title?: string;            // Custom title
  description?: string;      // Custom description
  instructionText?: string;  // Custom instruction text
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  shopUser,
  planFeatures,
  // Default values - if no props passed, use these
  customerLabel = "Customer",
  title = "Customer QR Code",
  description = "Seamless customer onboarding for your bike shop!",
  instructionText = "For your customers:"
}) => {
  if (!shopUser?.shopCode) return null;

  return (
    <div className="qr-section">
      <h2 className="qr-section__title">{title}</h2>
      <p className="qr-section__lead">{description}</p>
      <p className="qr-section__sub">
        {customerLabel}s scan &rarr; Auto-redirect to app store &rarr; App pre-filled with shop code &rarr; Instant login!
      </p>

      {/* Before / after comparison */}
      <div className="qr-compare">
        <p className="qr-compare__label">What's improved</p>
        <div className="qr-compare__grid">
          <div className="qr-compare__col">
            <p className="qr-compare__col-title">Before (7 steps)</p>
            <ol className="qr-compare__list">
              <li>Get shop code from staff</li>
              <li>Download app manually</li>
              <li>Open app</li>
              <li>Navigate to login</li>
              <li>Type shop code</li>
              <li>Tap continue</li>
              <li>Complete Strava auth</li>
            </ol>
          </div>
          <div className="qr-compare__col qr-compare__col--after">
            <p className="qr-compare__col-title">After (3 steps)</p>
            <ol className="qr-compare__list">
              <li>Scan QR code</li>
              <li>App opens automatically</li>
              <li>Complete Strava auth</li>
            </ol>
            <p className="qr-compare__note">Shop code auto-filled</p>
          </div>
        </div>
      </div>

      {/* QR Code Generator */}
      <QrCodeGenerator
        shopCode={shopUser.shopCode}
        shopName={shopUser.shopName}
        size={200}
        onError={(error) => console.error('QR Code Error:', error)}
      />

      {/* Instructions for shop owners */}
      <div className="qr-instructions">
        <h3>How to use your QR code</h3>
        <p><strong>{instructionText}</strong></p>
        <blockquote className="qr-quote">
          "Scan this QR code with your phone to get our bike maintenance app - it'll set everything up automatically!"
        </blockquote>

        <p><strong>Ways to share:</strong></p>
        <ul className="qr-share-list">
          <li><strong>Print it</strong> and display prominently in your shop</li>
          <li><strong>Add to business cards</strong> or promotional materials</li>
          <li><strong>Share digitally</strong> via email or social media</li>
          <li><strong>Show on tablet/phone</strong> for customers to scan</li>
        </ul>
      </div>
    </div>
  );
};

export default QRCodeSection;
