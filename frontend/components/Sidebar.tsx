'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Bot, BookOpen, Target, Mic2, Newspaper,
  Users, Settings, LogOut, Flame, Star, Menu, X, Shield, Calendar
} from 'lucide-react';
import { useState } from 'react';

const studentNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/mentor', icon: Bot, label: 'AI Mentor' },
  { href: '/ncert', icon: BookOpen, label: 'NCERT Hub' },
  { href: '/practice', icon: Target, label: 'Daily Practice' },
  { href: '/interview', icon: Mic2, label: 'Mock Interview' },
  { href: '/current-affairs', icon: Newspaper, label: 'Current Affairs' },
  { href: '/important-dates', icon: Calendar, label: 'Important Dates' },
];

const parentNav = [
  { href: '/parent', icon: Users, label: 'Parent Dashboard' },
];

const adminNav = [
  { href: '/admin', icon: Shield, label: 'Admin Panel' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'parent' ? parentNav : studentNav;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[#2a2a3d]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center text-lg font-bold">
            S
          </div>
          <div>
            <div className="font-bold text-sm text-white">Sakshi's Mentor</div>
            <div className="text-xs text-[#8888aa]">Your IAS Journey</div>
          </div>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="p-4 mx-3 mt-4 rounded-xl bg-[#1a1a28] border border-[#2a2a3d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#f5c842] flex items-center justify-center text-sm font-bold">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user.name}</div>
              <div className="text-xs text-[#8888aa]">
                {user.role === 'student' ? `Class ${user.currentClass}` : user.role}
              </div>
            </div>
            {user.streak > 0 && (
              <div className="flex items-center gap-1 text-orange-400 text-xs font-bold streak-fire">
                <Flame size={14} /> {user.streak}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`sidebar-item ${pathname === href || pathname.startsWith(href + '/') ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#2a2a3d] space-y-1">
        <div className="px-4 py-2 text-xs text-[#8888aa] flex items-center gap-2">
          <Star size={12} className="text-[#f5c842]" />
          <span>Dream: IAS Officer 2035</span>
        </div>
        <button onClick={logout} className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#12121a] border border-[#2a2a3d] p-2 rounded-lg"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
