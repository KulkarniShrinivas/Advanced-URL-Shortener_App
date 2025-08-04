import React from 'react';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-10 rounded-lg shadow-xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the URL Shortener App</h1>
        <p className="text-lg text-gray-600 mb-8">Please log in to create and manage your links.</p>
        <button
          onClick={onLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
