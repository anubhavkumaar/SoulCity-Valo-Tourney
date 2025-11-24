import "./globals.css";
import { TournamentProvider } from "@/context/TournamentContext";
import Link from 'next/link';

export const metadata = {
  title: "SoulCity Valorant",
  description: "Official Tournament",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TournamentProvider>
          <nav className="fixed top-0 w-full z-50 bg-[#0f1923]/90 border-b border-white/10 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="text-2xl font-black uppercase tracking-tighter text-white">
                SoulCity<span className="text-[#ff4655]">Valo</span>
              </div>
              <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-gray-300">
                <Link href="/" className="hover:text-[#ff4655] transition">Home</Link>
                <Link href="/bracket" className="hover:text-[#ff4655] transition">Bracket</Link>
                <Link href="/teams" className="hover:text-[#ff4655] transition">Teams</Link>
                <Link href="/streams" className="hover:text-[#ff4655] transition text-[#ff4655]">Live Streams</Link>
                <Link href="/admin" className="text-gray-500 hover:text-white transition">Admin</Link>
              </div>
            </div>
          </nav>
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </TournamentProvider>
      </body>
    </html>
  );
}