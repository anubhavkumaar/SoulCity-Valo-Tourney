"use client";
import { useState } from 'react';
import { useTournament } from "@/context/TournamentContext";

export default function TeamsPage() {
  const { teams } = useTournament();
  const [selectedTeam, setSelectedTeam] = useState(null); // Stores the team currently being viewed
  
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-black uppercase mb-8 border-l-4 border-valorant-red pl-4">Roster</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map(team => (
          <div 
            key={team.id} 
            onClick={() => setSelectedTeam(team)}
            className="bg-white/5 border border-white/10 p-6 hover:border-valorant-red hover:bg-white/10 transition group cursor-pointer"
          >
            <h2 className="text-2xl font-bold uppercase mb-4 group-hover:text-valorant-red">{team.name}</h2>
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
          <div className="bg-[#0f1923] border border-valorant-red w-full max-w-lg p-6 rounded-lg relative shadow-[0_0_30px_rgba(255,70,85,0.2)] animate-fade-in-up">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedTeam(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-3xl font-black uppercase mb-2 text-white">{selectedTeam.name}</h2>
            <p className="text-sm text-valorant-red font-bold uppercase tracking-widest mb-6">Active Roster</p>

            <div className="space-y-2">
              {selectedTeam.roster && selectedTeam.roster.length > 0 ? (
                selectedTeam.roster.map((player, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/10">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg">{player.name}</span>
                      <span className="text-xs text-gray-500">#{player.discord}</span>
                    </div>
                    <span className="text-xs font-bold uppercase bg-white/10 px-2 py-1 rounded text-valorant-red">
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
              className="btn-valo w-full mt-8"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}