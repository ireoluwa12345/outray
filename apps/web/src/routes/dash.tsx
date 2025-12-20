import {
  createFileRoute,
  Outlet,
  Link,
  useLocation,
} from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Network,
  Settings,
  Search,
  HelpCircle,
  History,
  Globe,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute("/dash")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const path = location.pathname.split("/").pop() || "overview";

  return (
    <div className="min-h-screen bg-[#070707] text-gray-300 font-sans selection:bg-accent/30">
      <div className="flex h-screen overflow-hidden">

        <div className={`${isCollapsed ? "w-20" : "w-72"} flex flex-col transition-all duration-300 ease-in-out border-r border-white/5 bg-[#070707]`}>
          <div className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
                  <div className="w-4 h-4 bg-black rounded-full" />
                </div>
                <p className="font-bold text-white text-lg tracking-tight">OutRay</p>
              </div>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>

          <div className="px-4 py-2">
            <button className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-between"} px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm text-gray-300 transition-all group hover:border-white/10 hover:shadow-lg hover:shadow-black/20`}>
              <span className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(255,166,43,0.5)]" />
                </div>
                {!isCollapsed && <span className="font-medium">Personal</span>}
              </span>
              {!isCollapsed && (
                <span className="text-gray-500 group-hover:text-gray-400">
                  <ChevronRight size={14} className="rotate-90" />
                </span>
              )}
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-hide">
            <div className="px-2 py-2 mb-4">
              {isCollapsed ? (
                <button className="w-full flex justify-center p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                  <Search size={20} />
                </button>
              ) : (
                <div className="relative group">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-white/5 border border-white/5 rounded-xl text-sm text-gray-300 placeholder-gray-600 pl-10 pr-10 py-2.5 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all shadow-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                    <span className="text-[10px] font-mono text-gray-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">⌘K</span>
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="px-4 mt-2 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                Platform
              </div>
            )}
            <NavItem
              to="/dash"
              icon={<LayoutDashboard size={20} />}
              label="Overview"
              activeOptions={{ exact: true }}
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/dash/tunnels"
              icon={<Network size={20} />}
              label="Active Tunnels"
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/dash/requests"
              icon={<History size={20} />}
              label="Requests"
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/dash/subdomains"
              icon={<Globe size={20} />}
              label="Subdomains"
              isCollapsed={isCollapsed}
            />

            {!isCollapsed && (
              <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                Configuration
              </div>
            )}
            <NavItem
              to="/dash/settings"
              icon={<Settings size={20} />}
              label="Settings"
              isCollapsed={isCollapsed}
            />
          </nav>

          <div className="p-3 border-t border-white/5 space-y-2 bg-black/20">
            {!isCollapsed && (
              <div className="px-3 py-2 bg-linear-to-br from-accent/10 to-transparent rounded-xl border border-accent/10 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-accent">Free Plan</span>
                  <span className="text-[10px] text-accent/70">2/5 Tunnels</span>
                </div>
                <div className="h-1.5 bg-accent/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/5 bg-accent rounded-full" />
                </div>
              </div>
            )}
            
            <button className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} w-full px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors group`}>
              <HelpCircle size={20} />
              {!isCollapsed && <span>Help & Support</span>}
            </button>
            
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} px-2 py-2 mt-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5`}>
              <div className="w-9 h-9 rounded-full bg-linear-to-tr from-accent to-orange-600 flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-accent/20 shrink-0">
                AK
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate group-hover:text-accent transition-colors">
                      akinloluwami
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      akin@outray.app
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <LogOut size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>


        <div className="flex-1 flex flex-col min-w-0 bg-[#101010] border border-white/5 m-2 rounded-2xl">
          {/* <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black">
           
          </header> */}

          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  to,
  activeOptions,
  isCollapsed,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  activeOptions?: { exact: boolean };
  isCollapsed: boolean;
}) {
  return (
    <Link
      to={to}
      activeProps={{
        className: "bg-accent/10 text-accent font-medium border border-accent/20 shadow-[0_0_15px_rgba(255,166,43,0.1)]",
      }}
      inactiveProps={{
        className: "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent",
      }}
      activeOptions={activeOptions}
      className={`flex items-center ${isCollapsed ? "justify-center px-2" : "gap-3 px-3"} w-full py-2.5 text-sm rounded-xl transition-all duration-200 group relative`}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10">
          {label}
        </div>
      )}
    </Link>
  );
}
