import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import {
  Shield,
  LayoutDashboard,
  FileAudio,
  Activity,
  BarChart3,
  Menu,
  X,
  Circle,
} from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
  const { userData } = useAnalysis();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = userData?.name || 'Operator';
  const userInitial = userName.charAt(0).toUpperCase();

  const navItems = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Analyze',
      path: '/analyze',
      icon: FileAudio,
    },
    {
      label: 'Live',
      path: '/live',
      icon: Activity,
    },
    {
      label: 'Results',
      path: '/results',
      icon: BarChart3,
    },
  ];

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* =========================================================
          FLOATING NAVBAR
          ========================================================= */}
    <div className="h-24">
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">

        <div className="mx-auto max-w-5xl">

          <div
            className="
              pointer-events-auto
              relative
              rounded-full
              border border-slate-700/70
              bg-[#0b0e14]/90
              backdrop-blur-xl
              shadow-[0_12px_40px_rgba(0,0,0,0.35)]
            "
          >

            {/* ===================================================
                DESKTOP NAV
                =================================================== */}
            <div className="relative hidden md:flex items-center h-[58px] px-2">

              {/* -------------------------------------------------
                  LOGO SLOT
                  -------------------------------------------------
                  Replace the Shield below tomorrow with:

                  <img
                    src="/logo.png"
                    alt="VoxShield"
                    className="w-8 h-8 object-contain"
                  />

                  Place logo.png inside:
                  frontend/public/logo.png
                  ------------------------------------------------- */}

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="
                  flex items-center gap-2.5
                  px-3
                  shrink-0
                  group
                "
              >
                <div
                  className="
                    w-8 h-8
                    flex items-center justify-center
                    rounded-full
                    bg-emerald-500/10
                    border border-emerald-500/20
                    group-hover:border-emerald-400/40
                    transition-colors
                  "
                >
                  <Shield
                    className="
                      w-[17px] h-[17px]
                      text-emerald-400
                      group-hover:text-emerald-300
                      transition-colors
                    "
                    strokeWidth={1.8}
                  />
                </div>

                <span
                  className="
                    text-[20px]
                    font-semibold
                    tracking-[0.14em]
                    text-slate-100
                  "
                >
                   <span className="text-emerald-400">Vox</span>
  <span className="text-white">Shield</span>
                </span>
              </button>


              {/* Divider */}
              <div className="w-px h-6 bg-slate-800 mx-2" />


              {/* -------------------------------------------------
                  NAVIGATION
                  ------------------------------------------------- */}
              <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5">

                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className="relative"
                    >
                      {({ isActive }) => (
                        <div
                          className={`
                            relative
                            flex items-center gap-2
                            px-3.5 py-2
                            rounded-full
                            text-[12px]
                            font-medium
                            transition-all duration-200
                            ${
                              isActive
                                ? 'text-white'
                                : 'text-slate-500 hover:text-slate-200'
                            }
                          `}
                        >

                          {/* Active background */}
                          {isActive && (
                            <span
                              className="
                                absolute inset-0
                                rounded-full
                                bg-slate-800
                                border border-slate-700
                                shadow-sm
                              "
                            />
                          )}

                          <span className="relative flex items-center gap-2">

                            <Icon
                              className={`
                                w-3.5 h-3.5
                                ${
                                  isActive
                                    ? 'text-emerald-400'
                                    : 'text-slate-600'
                                }
                              `}
                              strokeWidth={1.8}
                            />

                            <span>{item.label}</span>

                          </span>

                        </div>
                      )}
                    </NavLink>
                  );
                })}

              </nav>


              {/* -------------------------------------------------
                  SYSTEM STATUS
                  ------------------------------------------------- */}
              {/* RIGHT SIDE — MEMBER + SYSTEM STATUS */}
<div className="ml-auto flex items-center gap-3 shrink-0">

  {/* System status */}
  <div className="flex items-center gap-2 px-2">
    <span className="relative flex h-2 w-2">
      <span
        className="
          absolute
          inline-flex
          h-full w-full
          rounded-full
          bg-emerald-400
          opacity-40
        "
      />

      <Circle
        className="relative w-2 h-2 text-emerald-400 fill-emerald-400"
      />
    </span>

    <span className="text-[10px] text-slate-500 tracking-wide">
      Ready
    </span>
  </div>

  {/* Divider */}
  <div className="w-px h-6 bg-slate-800" />

  {/* Member */}
  <div className="flex items-center gap-2.5">

    <div className="hidden lg:block text-right">
      <p className="text-[11px] font-medium text-slate-300 leading-none">
        {userName}
      </p>

      <p className="text-[10px] text-slate-600 mt-1">
        Verified session
      </p>
    </div>

    <div
      className="
        w-8 h-8
        rounded-full
        bg-slate-800
        border border-slate-700
        flex items-center justify-center
        text-[11px]
        font-semibold
        text-emerald-400
      "
    >
      {userInitial}
    </div>

  </div>

</div>

            </div>


            {/* ===================================================
                MOBILE NAV
                =================================================== */}
            <div className="md:hidden">

              <div className="h-[56px] flex items-center justify-between px-2">

                {/* Brand */}
                <button
                  type="button"
                  onClick={() => {
                    navigate('/dashboard');
                    closeMobile();
                  }}
                  className="flex items-center gap-2.5 px-2"
                >
                  <div
                    className="
                      w-8 h-8
                      rounded-full
                      flex items-center justify-center
                      bg-emerald-500/10
                      border border-emerald-500/20
                    "
                  >
                    <Shield
                      className="w-4 h-4 text-emerald-400"
                      strokeWidth={1.8}
                    />
                  </div>

                  <span
                    className="
                      text-[13px]
                      font-semibold
                      tracking-[0.14em]
                      text-white
                    "
                  >
                    <span className="text-emerald-400">Vox</span>
                    <span className="text-white">Shield</span>
                  </span>
                </button>


                {/* Mobile controls */}
                <div className="flex items-center gap-2">

                  <div className="flex items-center gap-1.5 px-2.5">
                    <Circle
                      className="w-2 h-2 text-emerald-400 fill-emerald-400"
                    />

                    <span className="text-[9px] text-slate-500">
                      Ready
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="
                      w-9 h-9
                      rounded-full
                      flex items-center justify-center
                      text-slate-400
                      hover:text-white
                      hover:bg-slate-800
                      transition-colors
                    "
                    aria-label="Toggle navigation"
                    aria-expanded={mobileOpen}
                  >
                    {mobileOpen ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Menu className="w-4 h-4" />
                    )}
                  </button>

                </div>

              </div>


              {/* Mobile menu */}
              {mobileOpen && (
                <div
                  className="
                    border-t border-slate-800/80
                    px-2 pb-2 pt-2
                  "
                >

                  <nav className="space-y-1">

                    {navItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={closeMobile}
                          className={({ isActive }) => `
                            flex items-center gap-3
                            px-4 py-3
                            rounded-2xl
                            text-sm
                            transition-colors
                            ${
                              isActive
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'
                            }
                          `}
                        >
                          <Icon
                            className="w-4 h-4"
                            strokeWidth={1.8}
                          />

                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}

                  </nav>

                </div>
              )}

            </div>

          </div>

        </div>

      </header>
      </div>
    </>
  );
}