import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/public/images/hero-banner.jpg" 
          alt="Background" 
          fill 
          className="object-cover opacity-60" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-valorant-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center">
        <div className="mb-8 w-full max-w-lg drop-shadow-[0_0_25px_rgba(255,70,85,0.3)]">
           <Image src="/logo.png" alt="SoulCity Logo" width={600} height={200} className="w-full h-auto" />
        </div>
        
        <h2 className="text-valorant-red font-bold tracking-[0.3em] uppercase mb-2">Tournament Live</h2>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-lg">
          Valorant Protocol
        </h1>
        <p className="text-xl text-gray-300 mb-10 font-medium">
          16 Teams • Double Elimination • ₹50,000 Prize Pool
        </p>

        <div className="flex gap-4">
          <Link href="/bracket" className="btn-valo">View Bracket</Link>
          <Link href="/streams" className="btn-valo-outline">Watch Live</Link>
        </div>
      </div>
    </div>
  );
}