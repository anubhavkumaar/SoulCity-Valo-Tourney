import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* FIXED: Path removed '/public', changed extension to .png */}
        <Image 
          src="/images/hero-banner.png" 
          alt="Background" 
          fill 
          className="object-cover opacity-60" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1923] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center">
        <div className="mb-8 w-full max-w-lg drop-shadow-[0_0_25px_rgba(255,70,85,0.3)]">
           {/* FIXED: Path updated to /images/logo.png */}
           <Image src="/images/logo.png" alt="SoulCity Logo" width={600} height={200} className="w-full h-auto" />
        </div>
        
        <h2 className="text-[#ff4655] font-bold tracking-[0.3em] uppercase mb-2">Tournament Live</h2>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-lg">
          Valorant Protocol
        </h1>
        <p className="text-xl text-gray-300 mb-10 font-medium">
          16 Teams • Double Elimination • ₹50,000 Prize Pool
        </p>

        <div className="flex gap-4">
          <Link href="/bracket" className="bg-[#ff4655] hover:bg-[#d93542] text-white font-bold py-3 px-8 uppercase tracking-widest clip-path-polygon transition">
            View Bracket
          </Link>
          <Link href="/streams" className="border border-white text-white hover:bg-white hover:text-black font-bold py-3 px-8 uppercase tracking-widest transition">
            Watch Live
          </Link>
        </div>
      </div>
    </div>
  );
}