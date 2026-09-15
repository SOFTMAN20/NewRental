/**
 * FLOATING WHATSAPP BUTTON WITH ANIMATED MESSAGES
 * ================================================
 * 
 * Floating WhatsApp button with rotating help messages
 * Messages appear and disappear with smooth animations
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  message?: string;
}

const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '+255750939217', // Wanachuo.com Company Support Number
  message = 'Habari! Nahitaji msaada kutafuta nyumba. (Hello! I need help finding accommodation.)'
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(true);

  // Animated messages that rotate
  const messages = [
    'Need help? 💬',
    'Unahitaji msaada? 🤝',
    'Chat with us! 💭'
  ];

  useEffect(() => {
    // Show message for 4 seconds, hide for 2 seconds, then next message
    const showInterval = setInterval(() => {
      setShowMessage(false);
      
      // After fade out (500ms), change message
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setShowMessage(true);
      }, 500);
    }, 6000); // Total cycle: 6 seconds (4s visible + 2s hidden)

    return () => clearInterval(showInterval);
  }, []);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-[90]">
      <div className="relative">
        {/* Animated Message Bubble */}
        <div
          className={`absolute bottom-full right-0 mb-2 transition-all duration-500 ${
            showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-xl border border-gray-200 whitespace-nowrap font-medium text-sm">
            {messages[currentMessageIndex]}
            {/* Speech bubble tail */}
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
          </div>
        </div>

        {/* WhatsApp Button - Official WhatsApp Style */}
        <Button
          onClick={handleClick}
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-0 h-10 w-10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="h-8 w-8 fill-current"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>

          {/* Notification pulse dot - WhatsApp style */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3B30] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF3B30] border border-white"></span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default FloatingWhatsApp;
