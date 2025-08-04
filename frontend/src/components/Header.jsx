import React from 'react';

const Header = ({ user, onLogin, onLogout }) => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Advanced URL Shortener</h1>
        <div className="auth-status">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-lg">Welcome, {user.displayName}!</span>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Login with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
