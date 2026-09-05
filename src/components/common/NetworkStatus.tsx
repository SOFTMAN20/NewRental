/**
 * NETWORK STATUS COMPONENT
 * =========================
 * Detects offline/online status and shows notification
 * Handles network connectivity gracefully
 */

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowNotification(true);
        // Hide "back online" message after 3 seconds
        setTimeout(() => setShowNotification(false), 3000);
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return (
    <AnimatePresence>
      {(showNotification || !isOnline) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100]"
        >
          <div
            className={`${
              isOnline
                ? 'bg-green-500'
                : 'bg-red-500'
            } text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5" />
                <span className="font-medium">Mtandao Umerejea! 🎉</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 animate-pulse" />
                <span className="font-medium">Hakuna Mtandao</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus;
