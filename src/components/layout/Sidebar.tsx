import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Weight, 
  Utensils, 
  Activity, 
  CalendarHeart, 
  SmilePlus, 
  Target, 
  Award,
  UserCog
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { t } = useAppContext();

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: t('dashboard') },
    { to: '/weight', icon: <Weight size={20} />, label: t('weight') },
    { to: '/nutrition', icon: <Utensils size={20} />, label: t('nutrition') },
    { to: '/exercise', icon: <Activity size={20} />, label: t('exercise') },
    { to: '/fertility', icon: <CalendarHeart size={20} />, label: t('fertility') },
    { to: '/emotional', icon: <SmilePlus size={20} />, label: t('emotional') },
    { to: '/goals', icon: <Target size={20} />, label: t('goals') },
    { to: '/achievements', icon: <Award size={20} />, label: t('achievements') },
    { to: '/settings', icon: <UserCog size={20} />, label: t('settings') },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-50 transition-opacity md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 h-full w-64 flex flex-col bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 md:hidden">
          <span className="text-xl font-bold text-gray-900">
            {t('bodyBalance')}
          </span>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={toggleSidebar}
          >
            <span className="sr-only">{t('closeSidebar')}</span>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 bg-white space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleSidebar();
                }
              }}
              className={({ isActive }) => `
                flex items-center px-2 py-2 text-base font-medium rounded-md group transition-colors
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;