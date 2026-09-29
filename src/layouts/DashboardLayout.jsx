import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar
        onToggleSidebar={handleToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="dashboard-layout">
        {/* Desktop & Tablet Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              zIndex: 90,
              display: 'flex'
            }}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div
              style={{
                width: '280px',
                height: '100%',
                backgroundColor: '#ffffff',
                boxShadow: 'var(--shadow-xl)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                isCollapsed={false}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
