"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Users, Power, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Crowd Entries",
    href: "/dashboard/entries",
    icon: Users,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed = false, onToggle, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={`${isCollapsed ? 'w-[70px]' : 'w-[220px]'} min-h-screen flex flex-col relative overflow-hidden transition-all duration-300`}
      style={{
        background: 'linear-gradient(180deg, #1a3a3a 0%, #0f2828 50%, #0a1f1f 100%)',
      }}
    >
      {/* Geometric Pattern Background */}
      <div className="absolute bottom-0 left-0 w-full h-[60%] opacity-30 pointer-events-none">
        <svg
          viewBox="0 0 200 300"
          className="w-full h-full"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <g stroke="url(#lineGradient)" strokeWidth="0.5" fill="none">
            <line x1="0" y1="300" x2="80" y2="200" />
            <line x1="80" y1="200" x2="40" y2="150" />
            <line x1="40" y1="150" x2="100" y2="100" />
            <line x1="100" y1="100" x2="60" y2="50" />
            <line x1="80" y1="200" x2="150" y2="180" />
            <line x1="150" y1="180" x2="120" y2="120" />
            <line x1="120" y1="120" x2="180" y2="80" />
            <line x1="40" y1="150" x2="0" y2="100" />
            <line x1="100" y1="100" x2="150" y2="180" />
            <line x1="0" y1="250" x2="60" y2="220" />
            <line x1="60" y1="220" x2="80" y2="200" />
            <line x1="150" y1="180" x2="200" y2="220" />
            <line x1="120" y1="120" x2="100" y2="100" />
          </g>
          <g fill="#2dd4bf" fillOpacity="0.4">
            <circle cx="80" cy="200" r="3" />
            <circle cx="40" cy="150" r="2" />
            <circle cx="100" cy="100" r="3" />
            <circle cx="150" cy="180" r="2" />
            <circle cx="120" cy="120" r="2" />
            <circle cx="60" cy="220" r="2" />
            <circle cx="60" cy="50" r="2" />
            <circle cx="180" cy="80" r="2" />
          </g>
        </svg>
      </div>

      {/* Logo Header */}
      <div className="px-4 py-4 flex items-center gap-3 relative z-10">
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-0 opacity-0' : 'w-[120px] opacity-100'
          }`}
        >
          <Image
            src="/kloudspot.png"
            alt="Kloudspot"
            width={120}
            height={67}
            className="brightness-0 invert"
          />
        </div>
        <button
          onClick={handleToggle}
          className={`text-gray-400 hover:text-white p-1 transition-all duration-300 ${
            isCollapsed ? 'mx-auto' : 'ml-auto'
          }`}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-4 px-2 relative z-10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onMobileClose?.()}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 mb-1 ${
                isActive
                  ? 'bg-gray-500/40 text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span
                className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 relative z-10">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white transition-all duration-300 w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <Power size={18} className="flex-shrink-0" />
          <span
            className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
