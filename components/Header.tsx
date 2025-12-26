
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-800/50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-pink-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tighter">MOTIONFLOW</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Technology</a>
          <a href="#" className="hover:text-white transition-colors">Showcase</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all">
            Documentation
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
