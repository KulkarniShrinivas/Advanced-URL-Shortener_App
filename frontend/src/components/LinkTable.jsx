import React from 'react';

const LinkTable = ({ links, onViewAnalytics }) => {
  if (!links || links.length === 0) {
    return <p className="text-center text-gray-600 mt-8">You haven't created any short URLs yet.</p>;
  }

  return (
    <div className="overflow-x-auto mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Shortened URLs</h3>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Short URL</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Long URL</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Topic</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Clicks</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, index) => (
            <tr key={link.alias || index} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="py-3 px-4 border-b border-gray-200">
                <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {link.shortUrl.split('/').pop()}
                </a>
              </td>
              <td className="py-3 px-4 border-b border-gray-200 truncate max-w-xs">{link.longUrl}</td>
              <td className="py-3 px-4 border-b border-gray-200">{link.topic || 'N/A'}</td>
              <td className="py-3 px-4 border-b border-gray-200">{link.totalClicks}</td>
              <td className="py-3 px-4 border-b border-gray-200">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-3 rounded-lg shadow-md text-sm transition duration-300 ease-in-out"
                  onClick={() => onViewAnalytics(link.alias)}
                >
                  View Analytics
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;
