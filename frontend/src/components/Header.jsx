import React from 'react';

const Header = ({ user, onLogin, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <h1>Advanced URL Shortener</h1>
        <div className="auth-status">
          {user ? (
            <>
              <span>Welcome, {user.displayName}!</span>
              <button onClick={onLogout}>Logout</button>
            </>
          ) : (
            <button onClick={onLogin}>Login with Google</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;