import {
  createFileRoute,
  Outlet,
  Link,
  useLocation,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  Network,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Plus,
  History,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/dash")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const location = useLocation();
  const path = location.pathname.split("/").pop() || "overview";
  const title = path === "dash" ? "overview" : path;

  return (
    <div className="min-h-screen bg-[#070707] text-gray-300 font-sans selection:bg-accent/30">
      <div className="flex h-screen overflow-hidden">

        <div className="w-64 flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-full" />
              </div>
              <p className="font-semibold text-white">OutRay</p>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
              <div className="w-4 h-4 border border-current rounded-sm" />
            </button>
          </div>

          <div className="px-4 py-2">
            <button className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-sm text-gray-300 transition-colors group">
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent/20 border border-accent/50" />
                Personal
              </span>
              <span className="text-gray-500 group-hover:text-gray-400">
                ▼
              </span>
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
            <div className="px-3 py-2">
              <div className="relative">
                <Search
                  className="absolute left-2.5 top-2.5 text-gray-500"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-transparent border-none text-sm text-gray-300 placeholder-gray-500 pl-8 focus:ring-0"
                />
              </div>
            </div>

            <div className="mt-4 mb-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Platform
            </div>
            <NavItem
              to="/dash"
              icon={<LayoutDashboard size={16} />}
              label="Overview"
              activeOptions={{ exact: true }}
            />
            <NavItem
              to="/dash/tunnels"
              icon={<Network size={16} />}
              label="Active Tunnels"
            />
            <NavItem
              to="/dash/requests"
              icon={<History size={16} />}
              label="Requests"
            />
            <NavItem
              to="/dash/subdomains"
              icon={<Globe size={16} />}
              label="Subdomains"
            />

            <div className="mt-6 mb-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Configuration
            </div>
            <NavItem
              to="/dash/settings"
              icon={<Settings size={16} />}
              label="Settings"
            />
          </nav>

          <div className="p-4 border-t border-white/5 space-y-1">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <HelpCircle size={16} />
              Help & Support
            </button>
            <div className="flex items-center gap-3 px-3 py-2 mt-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-accent to-purple-500" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  akinloluwami
                </div>
                <div className="text-xs text-gray-500 truncate">
                  Free Plan
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Settings size={14} />
              </button>
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
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  activeOptions?: { exact: boolean };
}) {
  return (
    <Link
      to={to}
      activeProps={{
        className: "bg-white/5 text-white font-medium",
      }}
      inactiveProps={{
        className: "text-gray-400 hover:text-white hover:bg-white/5",
      }}
      activeOptions={activeOptions}
      className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all duration-200"
    >
      {icon}
      {label}
    </Link>
  );
}
