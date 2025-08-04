import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Ensure your public/index.html includes the Tailwind CSS CDN link
// <script src="https://cdn.tailwindcss.com"></script>

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
