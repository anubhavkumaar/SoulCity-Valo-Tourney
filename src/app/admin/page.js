"use client";
import { useState } from 'react';
import { useTournament } from "@/context/TournamentContext";

export default function AdminPage() {
  const { teams, matches, updateMatch, addTeam, removeTeam, editTeam } = useTournament();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Form State
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing
  const [teamName, setTeamName] = useState('');
  const [rosterData, setRosterData] = useState([{ name: '', rank: '', discord: '' }]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") setIsAuthenticated(true);
    else alert("Invalid Password");
  };

  const handleAddRosterRow = () => {
    setRosterData([...rosterData, { name: '', rank: '', discord: '' }]);
  };

  const handleRosterChange = (index, field, value) => {
    const updated = [...rosterData];
    updated[index][field] = value;
    setRosterData(updated);
  };

  const handleEditClick = (team) => {
    setEditingId(team.id);
    setTeamName(team.name);
    // Ensure roster has at least one row or populate from team
    setRosterData(team.roster.length > 0 ? team.roster : [{ name: '', rank: '', discord: '' }]);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTeamName('');
    setRosterData([{ name: '', rank: '', discord: '' }]);
  };

  const handleSubmit = () => {
    if (!teamName) return alert("Team Name Required");
    
    if (editingId) {
      editTeam(editingId, teamName, rosterData);
      alert("Team Updated!");
      handleCancelEdit(); // Reset form
    } else {
      addTeam(teamName, rosterData);
      alert("Team Added!");
      handleCancelEdit(); // Reset form
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-8 rounded-lg w-full max-w-md backdrop-blur-md">
          <h2 className="text-2xl font-bold uppercase mb-6 text-valorant-red text-center">Admin Access</h2>
          <input 
            type="password" 
            className="w-full bg-black/50 border border-white/20 p-3 text-white mb-4 focus:outline-none focus:border-valorant-red transition"
            placeholder="Enter Password (admin123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-valo w-full">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* SECTION 1: ADD & MANAGE TEAMS */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-lg h-fit">
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
          <h2 className="text-2xl font-black uppercase">
            <span className="text-valorant-red">01 //</span> {editingId ? 'Edit Team' : 'Add Team'}
          </h2>
          {editingId && (
            <button onClick={handleCancelEdit} className="text-xs text-gray-400 hover:text-white underline">
              Cancel Edit
            </button>
          )}
        </div>
        
        {/* Team Form */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs uppercase font-bold text-gray-400 mb-1 block">Team Name</label>
            <input 
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-valorant-red outline-none"
              placeholder="e.g. Sentinels"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div>
             <label className="text-xs uppercase font-bold text-gray-400 mb-1 block">Roster</label>
             {rosterData.map((player, idx) => (
               <div key={idx} className="flex gap-2 mb-2">
                  <input 
                    className="flex-1 bg-black/50 border border-white/20 p-2 text-sm text-white" 
                    placeholder="IGN"
                    value={player.name}
                    onChange={(e) => handleRosterChange(idx, 'name', e.target.value)}
                  />
                  <input 
                    className="w-24 bg-black/50 border border-white/20 p-2 text-sm text-white" 
                    placeholder="Rank"
                    value={player.rank}
                    onChange={(e) => handleRosterChange(idx, 'rank', e.target.value)}
                  />
                  <input 
                    className="w-32 bg-black/50 border border-white/20 p-2 text-sm text-white" 
                    placeholder="Discord"
                    value={player.discord}
                    onChange={(e) => handleRosterChange(idx, 'discord', e.target.value)}
                  />
               </div>
             ))}
             <button onClick={handleAddRosterRow} className="text-xs text-valorant-red hover:underline mt-1">+ Add another player</button>
          </div>

          <button onClick={handleSubmit} className={`btn-valo w-full mt-4 ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}>
            {editingId ? 'Update Team' : 'Register Team'}
          </button>
        </div>

        {/* Existing Teams List */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Current Teams ({teams.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {teams.map((team) => (
              <div key={team.id} className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5 hover:border-white/20 transition">
                <div>
                  <span className="text-sm text-white font-bold block">{team.name}</span>
                  <span className="text-xs text-gray-500">{team.roster.length} Players</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(team)}
                    className="text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded transition uppercase font-bold"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm(`Delete ${team.name}?`)) removeTeam(team.id);
                    }}
                    className="text-xs bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded transition uppercase font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: MANAGE MATCHES */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-lg max-h-[800px] overflow-y-auto">
        <h2 className="text-2xl font-black uppercase mb-6 border-b border-white/10 pb-4">
          <span className="text-valorant-red">02 //</span> Manage Bracket
        </h2>

        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-black/40 border border-white/10 p-4 rounded">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-gray-500">{match.id}</span>
                <span className="text-xs font-bold uppercase text-valorant-red">
                   {match.name}
                </span>
              </div>

              {/* Match Controls */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                {/* Team 1 */}
                <div className="flex flex-col gap-1">
                   <span className={`text-sm font-bold truncate ${match.winner === match.team1 && match.team1 ? 'text-green-400' : 'text-white'}`}>
                     {match.team1 || match.source1 || 'TBD'}
                   </span>
                   {match.team1 && (
                     <button 
                       onClick={() => updateMatch(match.id, { winner: match.team1 })}
                       className="text-[10px] bg-white/10 hover:bg-green-600 px-2 py-1 rounded transition"
                     >
                       Set Winner
                     </button>
                   )}
                </div>

                {/* Scores */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-1">
                    <input 
                      type="number" 
                      className="w-10 bg-black border border-white/20 text-center text-white"
                      value={match.score1}
                      onChange={(e) => updateMatch(match.id, { score1: parseInt(e.target.value) || 0 })}
                    />
                    <span className="text-gray-500">-</span>
                    <input 
                      type="number" 
                      className="w-10 bg-black border border-white/20 text-center text-white"
                      value={match.score2}
                      onChange={(e) => updateMatch(match.id, { score2: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                 {/* Team 2 */}
                 <div className="flex flex-col gap-1 text-right items-end">
                   <span className={`text-sm font-bold truncate ${match.winner === match.team2 && match.team2 ? 'text-green-400' : 'text-white'}`}>
                     {match.team2 || match.source2 || 'TBD'}
                   </span>
                   {match.team2 && (
                     <button 
                       onClick={() => updateMatch(match.id, { winner: match.team2 })}
                       className="text-[10px] bg-white/10 hover:bg-green-600 px-2 py-1 rounded transition"
                     >
                       Set Winner
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}