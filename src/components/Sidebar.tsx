// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { Users, Settings, LogOut, PanelLeftClose, PanelLeft, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  activeTab = 'applicants', 
  setActiveTab, 
  isCollapsed = false, 
  setIsCollapsed 
}: SidebarProps) {
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setActiveTab?.(tab);
    setMobileOpen(false); // Close mobile drawer when link is clicked
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. MOBILE TOP HEADER (Visible only on screens < lg)        */}
      {/* ========================================================= */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0B132B] border-b border-slate-800 px-4 h-16 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.svg" 
            alt="Infnova Technologies" 
            className="h-9 w-auto object-contain" 
          />
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-orange-500" />}
        </button>
      </div>

      {/* Mobile Drawer Dark Backdrop */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ========================================================= */}
      {/* 2. SIDEBAR CONTAINER (Desktop Sidebar + Mobile Drawer)    */}
      {/* ========================================================= */}
      <aside 
        className={`bg-[#0B132B] text-slate-300 flex flex-col h-screen fixed lg:sticky top-0 left-0 border-r border-slate-800 transition-all duration-300 select-none z-50 shrink-0 ${
          /* Mobile Drawer Positioning */
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${
          /* Desktop Widths */
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {/* Header - Desktop Logo & Toggle */}
        <div className={`p-4 flex items-center border-b border-slate-800/60 h-20 ${
          isCollapsed ? 'lg:justify-center' : 'justify-between'
        }`}>
          {(!isCollapsed || mobileOpen) && (
            <div className="flex items-center overflow-hidden min-w-0">
              <img 
                src="/logo.svg" 
                alt="Infnova Technologies" 
                className="h-11 w-auto object-contain" 
              />
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed?.(!isCollapsed)}
            className="hidden lg:flex p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors items-center justify-center shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="w-5 h-5 text-orange-500" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Close Button inside Drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {(!isCollapsed || mobileOpen) && (
            <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Main Menu
            </div>
          )}

          {/* Applicants */}
          <button
            onClick={() => handleNavClick('applicants')}
            title="Applicants"
            className={`w-full flex items-center gap-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              (isCollapsed && !mobileOpen) ? 'justify-center px-0' : 'px-3.5'
            } ${
              activeTab === 'applicants'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            {(!isCollapsed || mobileOpen) && <span>Applicants</span>}
          </button>

          {/* Settings */}
          <button
            onClick={() => handleNavClick('settings')}
            title="Settings"
            className={`w-full flex items-center gap-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              (isCollapsed && !mobileOpen) ? 'justify-center px-0' : 'px-3.5'
            } ${
              activeTab === 'settings'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {(!isCollapsed || mobileOpen) && <span>Settings</span>}
          </button>
        </div>

        {/* Footer / User Profile & Logout */}
        <div className="p-3 border-t border-slate-800/60 bg-slate-900/40">
          <div className={`flex items-center ${isCollapsed && !mobileOpen ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div 
                title={user?.name || 'Admin User'} 
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm shrink-0"
              >
                {user?.name?.[0] || 'A'}
              </div>
              {(!isCollapsed || mobileOpen) && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin User'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@infnova.com'}</p>
                </div>
              )}
            </div>

            {(!isCollapsed || mobileOpen) && (
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}