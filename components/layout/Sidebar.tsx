'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, LogOut, Menu } from 'lucide-react';

const menuItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Crowd Entries',
    href: '/dashboard/entries',
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div
      className="w-[220px] min-h-screen flex flex-col relative overflow-hidden"
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
          {/* Network lines pattern */}
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
          {/* Dots at intersections */}
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
      <div className="p-5 flex items-center gap-3 relative z-10">
        <img
          src="/kloudspot.png"
          alt="Kloudspot"
          className="h-7 w-auto brightness-0 invert"
        />
        <button className="ml-auto text-gray-400 hover:text-white">
          <Menu size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-4 px-3 relative z-10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                isActive
                  ? 'bg-teal-600/80 text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 relative z-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
