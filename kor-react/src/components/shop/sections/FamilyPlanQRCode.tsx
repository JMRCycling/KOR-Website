import React from 'react';
import QrCodeGenerator from '../../common/QrCodeGenerator';
import { DashboardSectionProps } from '../types';
import './QRCodeSection.css';

// Extended props to allow plan-specific customization
interface QRCodeSectionProps extends DashboardSectionProps {
  customerLabel?: string; // "Customer" or "Family Member"
  title?: string; // Custom title
  description?: string; // Custom description
  instructionText?: string; // Custom instruction text
}

const FamilyPlanQRCodeSection: React.FC<QRCodeSectionProps> = ({
  shopUser,
  planFeatures,
  // Default values - if no props passed, use these
  title = 'Family Member QR Code',
  description = 'Easy app access for your family!'
}) => {
  if (!shopUser?.shopCode) return null;

  return (
    <div className="qr-section">
      <h2 className="qr-section__title">{title}</h2>
      <p className="qr-section__lead">{description}</p>

      {/* QR Code Generator */}
      <QrCodeGenerator
        shopCode={shopUser.shopCode}
        shopName={shopUser.shopName}
        size={200}
        onError={error => console.error('QR Code Error:', error)}
      />
    </div>
  );
};

export default FamilyPlanQRCodeSection;
