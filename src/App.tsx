import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import { useAppContext } from './context/AppContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userProfile } = useAppContext();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50 animate-gradient-x bg-size-200 flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {userProfile && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;