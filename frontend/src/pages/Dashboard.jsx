import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import LinkTable from '../components/LinkTable';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
     
        const fetchUserData = async () => {
            try {
          
                const response = await axios.get('/api/analytics/overall');
                if (response.status === 200) {
                    setUser({ displayName: 'Shrinivas Kulkarni' });
                    setLinks(response.data.urls);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleShorten = async (e) => {
        e.preventDefault();
        setMessage('Shortening URL...');
        
        const longUrl = e.target.longUrl.value;
        const customAlias = e.target.customAlias.value;
        const topic = e.target.topic.value;

        try {
            const response = await axios.post('/api/shorten', { longUrl, customAlias, topic });
            if (response.status === 201) {
                setMessage(`Success! Your short URL is: ${response.data.shortUrl}`);
               
                const newLinksResponse = await axios.get('/api/analytics/overall');
                setLinks(newLinksResponse.data.urls);
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
        <div className="container">
            <Header user={user} />
            <div className="url-form">
                <h3>Create a New Short URL</h3>
                <form onSubmit={handleShorten}>
                    <input name="longUrl" placeholder="Enter long URL" required />
                    <input name="customAlias" placeholder="Optional: Custom Alias" />
                    <input name="topic" placeholder="Optional: Topic (e.g., marketing)" />
                    <button type="submit">Shorten URL</button>
                </form>
                <p>{message}</p>
            </div>
            <LinkTable links={links} />
        </div>
    );
};

export default Dashboard;