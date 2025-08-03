import React from 'react';

const LinkTable = ({ links }) => {
  return (
    <>
      <h3>Your Shortened URLs</h3>
      {links.length > 0 ? (
        <table className="links-table">
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Long URL</th>
              <th>Topic</th>
              <th>Clicks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.alias}>
                <td>
                  <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                    {link.shortUrl.split('/').pop()}
                  </a>
                </td>
                <td>{link.longUrl}</td>
                <td>{link.topic || 'N/A'}</td>
                <td>{link.totalClicks}</td>
                <td className="actions">
                  <button className="analytics">View Analytics</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You haven't created any short URLs yet.</p>
      )}
    </>
  );
};

export default LinkTable;