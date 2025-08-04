import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import LoginPage from './components/LoginPage.jsx';
import AnalyticsModal from './components/AnalyticsModal.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedAliasForAnalytics, setSelectedAliasForAnalytics] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);

 
  const BASE_API_URL = '';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
     
      const response = await axios.get(`${BASE_API_URL}/api/analytics/overall`);
      if (response.status === 200) {
        
        setUser({ displayName: 'Logged In User' });
        setLinks(response.data.urls || []); 
      }
    } catch (error) {
      setUser(null);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = window.location.origin + `${BASE_API_URL}/api/auth/google`;
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${BASE_API_URL}/api/auth/logout`);
      setUser(null);
      setLinks([]);
      window.location.href = window.location.origin + `${BASE_API_URL}/`;
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.'); 
    }
  };

  const handleViewAnalytics = async (alias) => {
    setSelectedAliasForAnalytics(alias);
    setShowAnalyticsModal(true);
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const response = await axios.get(`${BASE_API_URL}/api/analytics/${alias}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsError('Failed to load analytics data.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const closeAnalyticsModal = () => {
    setShowAnalyticsModal(false);
    setSelectedAliasForAnalytics(null);
    setAnalyticsData(null);
    setAnalyticsError(null);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-700">Loading Application...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-900">
      
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      {user ? (
        <Dashboard
          user={user}
          links={links}
          setLinks={setLinks}
          onViewAnalytics={handleViewAnalytics}
        />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}

      {showAnalyticsModal && (
        <AnalyticsModal
          alias={selectedAliasForAnalytics}
          data={analyticsData}
          loading={analyticsLoading}
          error={analyticsError}
          onClose={closeAnalyticsModal}
        />
      )}
    </div>
  );
}

export default App;
