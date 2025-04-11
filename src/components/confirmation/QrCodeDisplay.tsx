import React from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent } from '@/components/ui/card';
import TripSummaryCardHeader from '@/components/trip-summary/CardHeader';
import { BookingInfo } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export interface QrCodeDisplayProps {
  bookingReference: string;
  booking?: BookingInfo;
}

const QrCodeDisplay = ({ bookingReference, booking }: QrCodeDisplayProps) => {
  const { t } = useTranslation();
  
  // Check if we have a valid reference before creating the URL
  const bookingUrl = bookingReference 
    ? `${window.location.origin}/booking-lookup?ref=${encodeURIComponent(bookingReference)}`
    : `${window.location.origin}/booking-lookup`;
  
  console.log("Generated QR code URL:", bookingUrl);
  console.log("Using payment reference:", bookingReference);
  
  // Function to download QR code as PNG
  const downloadQrCode = () => {
    const svg = document.getElementById('booking-qr-code');
    if (!svg) return;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      context?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `booking-${bookingReference || 'ticket'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };
  
  // Function to share booking reference
  const shareBooking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("confirmation.yourBooking", "Your Island Ferry Booking"),
          text: t("confirmation.bookingReference", "Booking Reference: {{reference}}", { reference: bookingReference }),
          url: bookingUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(bookingUrl);
      alert(t("confirmation.copiedToClipboard", "Booking link copied to clipboard"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6"
    >
      <Card>
        <TripSummaryCardHeader title={t("confirmation.yourTicket", "Your Ticket")} />
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
              <QRCode
                id="booking-qr-code"
                value={bookingUrl}
                size={180}
                level="H"
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-center text-gray-600 mb-4">
              {t("confirmation.scanQrCode", "Scan this QR code to view your booking details")}
            </p>
            {bookingReference && (
              <p className="text-sm text-center font-medium text-gray-700 mb-4">
                {t("confirmation.referenceNumber", "Reference: ")}{bookingReference}
              </p>
            )}
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={downloadQrCode}
                size="sm"
              >
                <Download className="h-4 w-4 mr-1" />
                {t("confirmation.download", "Download")}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={shareBooking}
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-1" />
                {t("confirmation.share", "Share")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QrCodeDisplay;
