"use client";
import { useState } from 'react';
import { useTournament } from "@/context/TournamentContext";

export default function TeamsPage() {
  const { teams, siteConfig, loading } = useTournament();
  const [selectedTeam, setSelectedTeam] = useState(null); 
  
  if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;

  // Check if page is enabled
  if (siteConfig && !siteConfig.showTeams) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0f1923] text-white text-center p-4">
            <h1 className="text-4xl font-black uppercase text-[#ff4655] mb-4">Access Restricted</h1>
            <p className="text-gray-400">The Teams page is currently hidden.</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-black uppercase mb-8 border-l-4 border-valorant-red pl-4 text-white">Roster</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map(team => (
          <div 
            key={team.id} 
            onClick={() => setSelectedTeam(team)}
            className="bg-white/5 border border-white/10 p-6 hover:border-[#ff4655] hover:bg-white/10 transition group cursor-pointer rounded"
          >
            <h2 className="text-2xl font-bold uppercase mb-4 text-white group-hover:text-[#ff4655]">{team.name}</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>{team.roster?.length || 0} Players Registered</span>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-4">Click to view roster</p>
            </div>
          </div>
        ))}
      </div>

      {/* TEAM DETAILS MODAL */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1923] border border-[#ff4655] w-full max-w-lg p-6 rounded-lg relative shadow-[0_0_30px_rgba(255,70,85,0.2)] animate-fade-in-up">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedTeam(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-3xl font-black uppercase mb-2 text-white">{selectedTeam.name}</h2>
            <p className="text-sm text-[#ff4655] font-bold uppercase tracking-widest mb-6">Active Roster</p>

            <div className="space-y-2">
              {selectedTeam.roster && selectedTeam.roster.length > 0 ? (
                selectedTeam.roster.map((player, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/10">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg">{player.name}</span>
                      <span className="text-xs text-gray-500">#{player.discord}</span>
                    </div>
                    <span className="text-xs font-bold uppercase bg-white/10 px-2 py-1 rounded text-[#ff4655]">
                      {player.rank}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No players registered.</p>
              )}
            </div>

            <button 
              onClick={() => setSelectedTeam(null)}
              className="w-full mt-8 bg-[#ff4655] text-white py-2 font-bold uppercase hover:bg-[#d93542] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}