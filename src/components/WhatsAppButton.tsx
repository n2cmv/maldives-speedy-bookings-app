
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WhatsAppButtonProps {
  phoneNumber: string;
  welcomeMessage?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  welcomeMessage = "Hello! I'm interested in booking a speedboat transfer.",
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Format phone number (remove any non-digit characters)
  const formattedPhone = phoneNumber.replace(/\D/g, '');
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(welcomeMessage);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Open a small popup window instead of a new tab
    const windowFeatures = 'width=600,height=600,resizable=yes,scrollbars=yes,status=yes';
    window.open(whatsappUrl, 'WhatsAppChat', windowFeatures);
    
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-3 w-72 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full p-2 mr-2">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-gray-800">
                {t("whatsapp.title", "Chat with us")}
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {t("whatsapp.message", "Have questions about our speedboat transfers? Chat with our team on WhatsApp!")}
          </p>
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {t("whatsapp.startChat", "Start Chat")}
          </button>
        </div>
      )}
      
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 hover:bg-green-600 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 group"
          aria-label="WhatsApp Contact"
        >
          <WhatsAppIcon className="h-7 w-7 text-white" />
          <span className="sr-only">{t("whatsapp.contact", "Contact via WhatsApp")}</span>
        </button>
      )}
    </div>
  );
};

// Custom WhatsApp SVG icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
    />
  </svg>
);

export default WhatsAppButton;
