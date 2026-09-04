import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import { Shield, FileAudio, BarChart2, Activity, User, LogOut, Server, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Navbar() {
  const { userData, logoutUser, isMockMode, toggleMockMode } = useAnalysis();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) =>
    `flex items-center space-x-2 px-3 py-1.5 text-xs font-mono tracking-wider rounded transition-colors ${
      isActive
        ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-bold'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
    }`;

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Mark */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-900 border border-emerald-500/60 rounded flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono font-bold tracking-widest text-slate-100 uppercase">
                  AURA-VOICE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-900 border border-slate-700 text-emerald-400 rounded">
                  SEC-LAB
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono hidden sm:block">
                AI VOICE CLONING & SPOOF DETECTION
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink to="/analyze" className={navLinkStyle}>
              <FileAudio className="w-4 h-4" />
              <span>ANALYZER</span>
            </NavLink>
            <NavLink to="/results" className={navLinkStyle}>
              <BarChart2 className="w-4 h-4" />
              <span>DETAILED REPORT</span>
            </NavLink>
            <NavLink to="/live" className={navLinkStyle}>
              <Activity className="w-4 h-4" />
              <span>LIVE MONITOR</span>
            </NavLink>
          </nav>

          {/* Controls & User Identification */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Backend Server Status & Mock Switcher */}
            <div className="flex items-center space-x-2 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {isMockMode ? 'MOCK MODE' : 'FASTAPI BASE'}
              </span>
              <button
                onClick={() => toggleMockMode()}
                title={isMockMode ? 'Switch to real FastAPI backend' : 'Switch to offline development mock'}
                className="text-slate-400 hover:text-emerald-400 transition-colors ml-1"
              >
                {isMockMode ? (
                  <ToggleRight className="w-5 h-5 text-amber-400" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-emerald-500" />
                )}
              </button>
            </div>

            {/* User Identification Badge */}
            {userData ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-mono text-slate-300 max-w-[120px] truncate">
                    {userData.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout / Change User"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs rounded transition-colors"
              >
                IDENTIFY
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-slate-100"
            >
              <Activity className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-2">
          <NavLink
            to="/analyze"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-mono text-slate-300 hover:bg-slate-900 rounded"
          >
            AUDIO ANALYZER
          </NavLink>
          <NavLink
            to="/results"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-mono text-slate-300 hover:bg-slate-900 rounded"
          >
            DETAILED REPORT
          </NavLink>
          <NavLink
            to="/live"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-mono text-slate-300 hover:bg-slate-900 rounded"
          >
            LIVE MONITORING
          </NavLink>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
            <button
              onClick={() => toggleMockMode()}
              className="text-xs font-mono text-slate-400 flex items-center gap-1"
            >
              MODE: {isMockMode ? 'OFFLINE MOCK' : 'LIVE FASTAPI'}
            </button>
            {userData && (
              <button
                onClick={handleLogout}
                className="text-xs font-mono text-red-400 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> LOGOUT
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
