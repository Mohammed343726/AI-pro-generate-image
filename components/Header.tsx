
import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
    <div className="container mx-auto px-4 py-4 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        AI Professional Image Generator
      </h1>
      <p className="text-gray-400 mt-1 text-sm sm:text-base">
        Transform your ideas into stunning visuals with Gemini
      </p>
    </div>
  </header>
);
