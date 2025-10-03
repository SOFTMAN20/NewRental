import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import './data/i18n/config'
import { initPerformanceMonitoring } from './utils/performance'

// Initialize performance monitoring
initPerformanceMonitoring();

createRoot(document.getElementById("root")!).render(<App />);
