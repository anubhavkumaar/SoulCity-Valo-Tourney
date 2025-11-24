"use client";
import { useState } from 'react';
import { useTournament } from "@/context/TournamentContext";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export default function AdminPage() {
  const { 
    teams, 
    matches, 
    updateMatch, 
    addTeam, 
    removeTeam, 
    editTeam,
    streamSettings,
    updateStreamSettings
  } = useTournament();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Team Form State
  const [editingId, setEditingId] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [rosterData, setRosterData] = useState([{ name: '', rank: '', discord: '' }]);

  // Stream Form State
  const [hashtag, setHashtag] = useState(streamSettings.hashtag);
  const [foundStreams, setFoundStreams] = useState([]);
  const [scanning, setScanning] = useState(false);

  // --- AUTHENTICATION ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") setIsAuthenticated(true);
    else alert("Invalid Password");
  };

  // --- TEAM MANAGEMENT LOGIC ---
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
    setRosterData(team.roster.length > 0 ? team.roster : [{ name: '', rank: '', discord: '' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTeamName('');
    setRosterData([{ name: '', rank: '', discord: '' }]);
  };

  const handleSubmitTeam = () => {
    if (!teamName) return alert("Team Name Required");
    if (editingId) {
      editTeam(editingId, teamName, rosterData);
      alert("Team Updated!");
      handleCancelEdit();
    } else {
      addTeam(teamName, rosterData);
      alert("Team Added!");
      handleCancelEdit();
    }
  };

  // --- STREAM MANAGEMENT LOGIC ---
  const scanStreams = async () => {
    setScanning(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&q=${encodeURIComponent(hashtag)}&key=${YOUTUBE_API_KEY}&maxResults=10`
      );
      const data = await res.json();
      if (data.items) {
        setFoundStreams(data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channel: item.snippet.channelTitle
        })));
      } else {
        setFoundStreams([]);
      }
    } catch (error) {
      console.error("YouTube API Error:", error);
      alert("Error scanning YouTube");
    } finally {
      setScanning(false);
    }
  };

  const handleSetStream = (slot, stream) => {
    updateStreamSettings({ [slot]: stream });
  };

  const handleSaveHashtag = () => {
    updateStreamSettings({ hashtag });
    alert(`Hashtag updated to #${hashtag}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-8 rounded-lg w-full max-w-md backdrop-blur-md">
          <h2 className="text-2xl font-bold uppercase mb-6 text-[#ff4655] text-center">Admin Access</h2>
          <input 
            type="password" 
            className="w-full bg-black/50 border border-white/20 p-3 text-white mb-4 focus:outline-none focus:border-[#ff4655] transition"
            placeholder="Enter Password (admin123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-[#ff4655] hover:bg-[#d93542] text-white font-bold py-3 px-6 w-full uppercase tracking-widest transition">
            Login
          </button>
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
            <span className="text-[#ff4655]">01 //</span> Teams
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
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-[#ff4655] outline-none"
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
             <button onClick={handleAddRosterRow} className="text-xs text-[#ff4655] hover:underline mt-1">+ Add another player</button>
          </div>

          <button onClick={handleSubmitTeam} className={`bg-[#ff4655] hover:bg-[#d93542] text-white font-bold py-3 px-4 w-full uppercase tracking-widest transition ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}>
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

      {/* SECTION 2: MANAGE BRACKET */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-lg max-h-[800px] overflow-y-auto">
        <h2 className="text-2xl font-black uppercase mb-6 border-b border-white/10 pb-4">
          <span className="text-[#ff4655]">02 //</span> Bracket
        </h2>

        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-black/40 border border-white/10 p-4 rounded">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-gray-500">{match.id}</span>
                <span className="text-xs font-bold uppercase text-[#ff4655]">
                   {match.name}
                </span>
              </div>

              {/* Match Controls */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
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

      {/* SECTION 3: STREAM MANAGEMENT (Full Width) */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-lg lg:col-span-2">
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
          <h2 className="text-2xl font-black uppercase">
            <span className="text-[#ff4655]">03 //</span> Live Broadcast
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-bold">Hashtag:</span>
            <input 
              className="bg-black/50 border border-white/20 text-white px-2 py-1 rounded text-sm w-32 focus:border-[#ff4655] outline-none"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
            />
            <button onClick={handleSaveHashtag} className="text-xs bg-[#ff4655] text-white px-3 py-1 rounded font-bold hover:bg-[#d93542]">Save</button>
          </div>
        </div>

        {/* Current Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {['main', 'pov1', 'pov2'].map(slot => (
            <div key={slot} className="bg-black/40 border border-white/10 p-3 rounded relative">
              <span className="absolute top-2 right-2 text-[10px] text-[#ff4655] font-bold uppercase border border-[#ff4655] px-1 rounded">
                {slot === 'main' ? 'Main Stream' : slot === 'pov1' ? 'POV 1' : 'POV 2'}
              </span>
              {streamSettings[slot] ? (
                <>
                  <div className="aspect-video bg-black mb-2">
                    <img src={streamSettings[slot].thumbnail} className="w-full h-full object-cover opacity-50" />
                  </div>
                  <p className="text-xs text-white font-bold truncate">{streamSettings[slot].title}</p>
                  <button 
                    onClick={() => handleSetStream(slot, null)}
                    className="text-[10px] text-red-500 mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <div className="h-24 flex items-center justify-center text-gray-500 text-xs uppercase">
                  Slot Empty
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scanner */}
        <div className="mb-4 flex gap-4">
          <button 
            onClick={scanStreams} 
            disabled={scanning}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded font-bold uppercase tracking-widest transition"
          >
            {scanning ? "Scanning..." : "Scan YouTube Streams"}
          </button>
        </div>

        {/* Found Streams */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {foundStreams.length > 0 ? foundStreams.map(video => (
            <div key={video.id} className="bg-black/30 border border-white/5 p-3 rounded group hover:border-[#ff4655] transition">
              <div className="aspect-video relative mb-2">
                <img src={video.thumbnail} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-white font-bold truncate mb-1" title={video.title}>{video.title}</p>
              <p className="text-[10px] text-gray-500 mb-3">{video.channel}</p>
              
              <div className="grid grid-cols-3 gap-1">
                <button onClick={() => handleSetStream('main', video)} className="text-[10px] bg-blue-900 text-blue-200 py-1 rounded hover:bg-blue-700">Main</button>
                <button onClick={() => handleSetStream('pov1', video)} className="text-[10px] bg-purple-900 text-purple-200 py-1 rounded hover:bg-purple-700">POV1</button>
                <button onClick={() => handleSetStream('pov2', video)} className="text-[10px] bg-purple-900 text-purple-200 py-1 rounded hover:bg-purple-700">POV2</button>
              </div>
            </div>
          )) : (
            !scanning && <p className="text-gray-500 text-sm italic col-span-full">No streams found yet. Click scan.</p>
          )}
        </div>

      </div>

    </div>
  );
}