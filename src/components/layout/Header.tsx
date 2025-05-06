import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Heart, Languages, Check } from 'lucide-react';
import { useAppContext, Language } from '../../context/AppContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { language, setLanguage } = useAppContext();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center space-x-2 ml-3 md:ml-0">
              <Heart className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">
                {language === 'en' ? 'Body Balance' : 'איזון הגוף'}
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                aria-expanded={isLangMenuOpen}
                aria-haspopup="true"
              >
                <Languages size={16} />
                <span className="font-medium text-sm">{language === 'en' ? 'EN' : 'עב'}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-40 ring-1 ring-black ring-opacity-5 transition-all">
                  <button
                    onClick={() => toggleLanguage('en')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center justify-between"
                    aria-current={language === 'en' ? 'true' : 'false'}
                  >
                    <span>English</span>
                    {language === 'en' && <Check size={16} className="text-indigo-600" />}
                  </button>
                  <button
                    onClick={() => toggleLanguage('he')}
                    className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center justify-between"
                    aria-current={language === 'he' ? 'true' : 'false'}
                  >
                    <span>עברית</span>
                    {language === 'he' && <Check size={16} className="text-indigo-600" />}
                  </button>
                </div>
              )}
            </div>
            
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <Bell size={20} />
            </button>
            <button className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <span className="font-medium text-sm">BB</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;