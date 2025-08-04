import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LinkTable from './LinkTable.jsx'; 

const Dashboard = ({ user, links, setLinks, onViewAnalytics }) => {
  const [message, setMessage] = useState('');
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [topic, setTopic] = useState('');


  useEffect(() => {
    const fetchInitialLinks = async () => {
      if (user) { 
        try {
          const response = await axios.get('/api/analytics/overall');
          if (response.status === 200) {
            setLinks(response.data.urls || []);
          }
        } catch (error) {
          console.error('Failed to fetch initial links:', error);
          setMessage('Failed to load your existing links.');
        }
      }
    };
    fetchInitialLinks();
  }, [user, setLinks]); 

  const handleShorten = async (e) => {
    e.preventDefault();
    setMessage('Shortening URL...');

    try {
      const response = await axios.post('/api/shorten', { longUrl, customAlias, topic });
      if (response.status === 201) {
        setMessage(`Success! Your short URL is: ${response.data.shortUrl}`);
       
        const newLinksResponse = await axios.get('/api/analytics/overall');
        setLinks(newLinksResponse.data.urls || []);
        
        setLongUrl('');
        setCustomAlias('');
        setTopic('');
      } else {
        setMessage(`Error: ${response.data.error || response.data.message}`);
      }
    } catch (error) {
      setMessage(`An unexpected error occurred: ${error.message}`);
      console.error('Shorten failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Create a New Short URL</h3>
        <form onSubmit={handleShorten} className="space-y-4">
          <input
            name="longUrl"
            placeholder="Enter long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="customAlias"
            placeholder="Optional: Custom Alias"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="topic"
            placeholder="Optional: Topic (e.g., marketing)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Shorten URL
          </button>
        </form>
        {message && <p className="message-area mt-4 text-center text-gray-700">{message}</p>}
      </div>
      <LinkTable links={links} onViewAnalytics={onViewAnalytics} />
    </div>
  );
};

export default Dashboard;
