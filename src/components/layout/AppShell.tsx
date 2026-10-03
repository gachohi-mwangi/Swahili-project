import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Volume2, Bookmark, MessageCircle, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const location = useLocation();
  const { user, signIn, logOut } = useAuth();

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const navItems = [
    { name: 'Scenarios', href: '/', icon: Home },
    { name: 'Soundboard', href: '/soundboard', icon: Volume2 },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Saved', href: '/saved', icon: Bookmark },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-transparent">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Learn Swahili</span>
          <h1 className="text-2xl font-serif font-semibold text-swahili-orange leading-tight">Jambo Swahili!</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
            isOnline ? 'bg-orange-100 text-orange-700' : 'bg-orange-100 text-orange-700'
          }`}>
            <div className="w-2 h-2 rounded-full bg-orange-500 status-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{isOnline ? 'Online' : 'Offline Mode'}</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <img src={user.photoURL || ''} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
              <button onClick={logOut} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Log Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={signIn}
              className="flex items-center gap-2 text-sm font-semibold text-swahili-orange bg-orange-50 px-3 py-1.5 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <LogIn size={16} />
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 pb-24 p-4 max-w-md mx-auto w-full">
        {children}
      </main>

      <nav className="fixed bottom-0 z-50 w-full bg-white border-t border-slate-100 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto flex justify-around items-center h-20 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link 
                key={item.name} 
                to={item.href}
                className={`flex flex-col items-center justify-center h-full gap-1 transition-colors ${
                  isActive ? 'text-swahili-orange' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-bold uppercase tracking-wider">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
