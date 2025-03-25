
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to remove Lovable badge
const removeLovableBadge = () => {
  const lovableBadge = document.getElementById('lovable-badge');
  if (lovableBadge) {
    lovableBadge.remove();
  }
};

// Remove badge on initial page load
window.addEventListener('load', removeLovableBadge);

createRoot(document.getElementById("root")!).render(<App />);

