import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import LinkTable from './components/LinkTable';

const App = () => {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/analytics/overall');
      if (response.status === 200) {
        setUser({ displayName: 'Shrinivas Kulkarni' }); 
        setLinks(response.data.urls);
      }
    } catch (error) {
      console.error('Not authenticated:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      setUser(null);
      setLinks([]);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleShorten = async (longUrl, customAlias, topic) => {
    try {
      const response = await axios.post('/api/shorten', { longUrl, customAlias, topic });
      if (response.status === 201) {
        setMessage(`Short URL created: ${response.data.shortUrl}`);
        checkAuthStatus(); 
      }
    } catch (error) {
      setMessage('Error creating short URL.');
      console.error('Shorten failed:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="container">
        {user ? (
          <>
            <h3>Create a New Short URL</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleShorten(e.target.longUrl.value, e.target.customAlias.value, e.target.topic.value);
            }}>
              <input name="longUrl" placeholder="Enter long URL" required />
              <input name="customAlias" placeholder="Optional: Custom Alias" />
              <input name="topic" placeholder="Optional: Topic (e.g., marketing)" />
              <button type="submit">Shorten URL</button>
            </form>
            <p>{message}</p>
            <LinkTable links={links} />
          </>
        ) : (
          <div>
            <h3>Welcome to the URL Shortener App</h3>
            <p>Please log in to create and manage your links.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default App;