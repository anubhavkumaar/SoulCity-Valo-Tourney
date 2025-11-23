"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path ? 'text-[#ff4655]' : 'text-gray-300 hover:text-white';

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f1923]/95 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-2xl font-black uppercase tracking-tighter text-white">
            SoulCity<span className="text-[#ff4655]">Valo</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest">
            <Link href="/" className={`${isActive('/')} transition`}>Home</Link>
            <Link href="/bracket" className={`${isActive('/bracket')} transition`}>Bracket</Link>
            <Link href="/teams" className={`${isActive('/teams')} transition`}>Teams</Link>
            <Link href="/streams" className={`${isActive('/streams')} transition`}>Streams</Link>
            <Link href="/admin" className={`${isActive('/admin')} transition`}>Admin</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[#ff4655] focus:outline-none"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#1c2733] border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-bold uppercase tracking-widest text-white hover:text-[#ff4655]"
            >
              Home
            </Link>
            <Link 
              href="/bracket" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-bold uppercase tracking-widest text-white hover:text-[#ff4655]"
            >
              Bracket
            </Link>
            <Link 
              href="/teams" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-bold uppercase tracking-widest text-white hover:text-[#ff4655]"
            >
              Teams
            </Link>
            <Link 
              href="/streams" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-bold uppercase tracking-widest text-white hover:text-[#ff4655]"
            >
              Streams
            </Link>
            <Link 
              href="/admin" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-bold uppercase tracking-widest text-gray-400 hover:text-white"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}