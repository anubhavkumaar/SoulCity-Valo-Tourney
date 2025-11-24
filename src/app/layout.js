import "./globals.css";
import { TournamentProvider } from "@/context/TournamentContext";
import { AuthContextProvider } from "@/context/AuthContext";
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: "SoulCity Valorant",
  description: "Official Tournament",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthContextProvider>
          <TournamentProvider>
            <nav className="fixed top-0 w-full z-50 bg-[#0f1923]/90 border-b border-white/10 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                
                <Link href="/" className="relative w-48 h-10 hover:opacity-80 transition-opacity">
                  <Image 
                    src="/images/soulcity-new-logo.png" 
                    alt="SoulCity Logo" 
                    fill 
                    className="object-contain object-left"
                    priority 
                  />
                </Link>

                <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-gray-300">
                  <Link href="/" className="hover:text-[#ff4655] transition">Home</Link>
                  <Link href="/bracket" className="hover:text-[#ff4655] transition">Bracket</Link>
                  <Link href="/teams" className="hover:text-[#ff4655] transition">Teams</Link>
                  <Link href="/streams" className="hover:text-[#ff4655] transition">Streams</Link>
                  <Link href="/admin" className="text-gray-500 hover:text-white transition flex items-center">Admin</Link>
                  <Link href="/register" className="text-[#ff4655] hover:text-white transition border border-[#ff4655] px-3 py-1 rounded hover:bg-[#ff4655]">Register</Link>
                </div>
              </div>
            </nav>
            <main className="pt-16 min-h-screen">
              {children}
            </main>
          </TournamentProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}