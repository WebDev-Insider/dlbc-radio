
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-church-50 to-gray-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-16 items-center">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-6 w-6 mr-2 text-church-600"
            >
              <path d="M18 8a5 5 0 0 0-10 0v7h10Z"/>
              <path d="M6 15a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3H6Z"/>
              <path d="M19 8a7 7 0 0 0-14 0"/>
              <line x1="12" y1="20" x2="12" y2="22"/>
            </svg>
            <span className="font-semibold text-lg">Church Radio Stream</span>
          </div>
        </div>
      </header>

      <main className="container py-6 flex-1">
        {children || <Outlet />}
      </main>

      <footer className="border-t py-6 bg-white/80">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Church Radio Stream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
