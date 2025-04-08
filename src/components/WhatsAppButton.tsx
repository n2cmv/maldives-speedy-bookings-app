
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
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
    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-3 w-72 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full p-2 mr-2">
                <MessageCircle className="h-5 w-5 text-white" />
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
            <MessageCircle className="h-4 w-4" />
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
          <MessageCircle className="h-7 w-7 text-white" />
          <span className="sr-only">{t("whatsapp.contact", "Contact via WhatsApp")}</span>
        </button>
      )}
    </div>
  );
};

export default WhatsAppButton;
