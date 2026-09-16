import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 404 Error: User attempted to access non-existent route
    console.log('[404] Page not found:', location.pathname);
    
    // Auto-redirect to homepage after 5 seconds
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate('/', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [location.pathname, navigate]);

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <div className="text-center px-4">
        <div className="text-8xl mb-4">🏠</div>
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <h2 className="text-3xl font-bold mb-4 text-gray-700">SORRY</h2>
        <p className="text-xl text-gray-600 mb-2">Ukurasa huu haupo / Page not found</p>
        <p className="text-lg text-gray-500 mb-6">
          Utapelekwa kwenye homepage kwa sekunde <span className="font-bold text-primary">{countdown}</span>
        </p>
        <button 
          onClick={handleGoHome}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Rudi Homepage Sasa / Go Home Now
        </button>
      </div>
    </div>
  );
};

export default NotFound;
