"use client";
import { useState, useMemo } from 'react';
import { useTournament } from "@/context/TournamentContext";
import { useAuth } from "@/context/AuthContext";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export default function AdminPage() {
  const { 
    teams, 
    matches,
    registrations,
    siteConfig,
    updateSiteConfig,
    updateMatch, 
    addTeam, 
    removeTeam, 
    editTeam,
    streamSettings,
    updateStreamSettings,
    initializeBracket,
    updatePlayerStatus,
    assignTier,
    assignCaptain
  } = useTournament();

  const { user, login, logout, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // UI State
  const [activeTab, setActiveTab] = useState('registrations');

  // Team Form State
  const [editingId, setEditingId] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [rosterData, setRosterData] = useState([{ name: '', rank: '', discord: '' }]);

  // Stream Form State
  const [hashtag, setHashtag] = useState(streamSettings?.hashtag || '');
  const [foundStreams, setFoundStreams] = useState([]);
  const [scanning, setScanning] = useState(false);

  // Registration Filter State
  const [tierFilter, setTierFilter] = useState('All');

  // --- AUTHENTICATION ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Check credentials.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  // --- INITIALIZATION ---
  const handleResetBracket = async () => {
    if(!confirm("WARNING: This will wipe all match data and reset the bracket structure. Continue?")) return;
    
    const createMatch = (id, name, nextWin, nextLose, src1, src2) => ({
        id, name, nextWin, nextLose, 
        source1: src1, source2: src2,
        team1: null, team2: null, score1: 0, score2: 0, winner: null
    });

    const data = [
        // WB R1
        { ...createMatch('M1', 'WB R1', 'M13', 'M9', 'Seed 1', 'Seed 16'), team1: null, team2: null },
        { ...createMatch('M2', 'WB R1', 'M13', 'M9', 'Seed 8', 'Seed 9'), team1: null, team2: null },
        { ...createMatch('M3', 'WB R1', 'M14', 'M10', 'Seed 5', 'Seed 12'), team1: null, team2: null },
        { ...createMatch('M4', 'WB R1', 'M14', 'M10', 'Seed 4', 'Seed 13'), team1: null, team2: null },
        { ...createMatch('M5', 'WB R1', 'M15', 'M11', 'Seed 6', 'Seed 11'), team1: null, team2: null },
        { ...createMatch('M6', 'WB R1', 'M15', 'M11', 'Seed 3', 'Seed 14'), team1: null, team2: null },
        { ...createMatch('M7', 'WB R1', 'M16', 'M12', 'Seed 7', 'Seed 10'), team1: null, team2: null },
        { ...createMatch('M8', 'WB R1', 'M16', 'M12', 'Seed 2', 'Seed 15'), team1: null, team2: null },
        // WB QF
        createMatch('M13', 'WB QF', 'M21', 'M20', 'Winner M1', 'Winner M2'),
        createMatch('M14', 'WB QF', 'M21', 'M19', 'Winner M3', 'Winner M4'),
        createMatch('M15', 'WB QF', 'M22', 'M18', 'Winner M5', 'Winner M6'),
        createMatch('M16', 'WB QF', 'M22', 'M17', 'Winner M7', 'Winner M8'),
        // WB Semi
        createMatch('M21', 'WB Semi', 'M27', 'M26', 'Winner M13', 'Winner M14'),
        createMatch('M22', 'WB Semi', 'M27', 'M25', 'Winner M15', 'Winner M16'),
        // WB Final
        createMatch('M27', 'WB Final', 'M30', 'M29', 'Winner M21', 'Winner M22'),
        // LB R1
        createMatch('M9', 'LB R1', 'M17', null, 'Loser M1', 'Loser M2'),
        createMatch('M10', 'LB R1', 'M18', null, 'Loser M3', 'Loser M4'),
        createMatch('M11', 'LB R1', 'M19', null, 'Loser M5', 'Loser M6'),
        createMatch('M12', 'LB R1', 'M20', null, 'Loser M7', 'Loser M8'),
        // LB R2
        createMatch('M17', 'LB R2', 'M23', null, 'Winner M9', 'Loser M16'),
        createMatch('M18', 'LB R2', 'M23', null, 'Winner M10', 'Loser M15'),
        createMatch('M19', 'LB R2', 'M24', null, 'Winner M11', 'Loser M14'),
        createMatch('M20', 'LB R2', 'M24', null, 'Winner M12', 'Loser M13'),
        // LB R3
        createMatch('M23', 'LB R3', 'M25', null, 'Winner M17', 'Winner M18'),
        createMatch('M24', 'LB R3', 'M26', null, 'Winner M19', 'Winner M20'),
        // LB R4
        createMatch('M25', 'LB R4', 'M28', null, 'Winner M23', 'Loser M22'),
        createMatch('M26', 'LB R4', 'M28', null, 'Winner M24', 'Loser M21'),
        // LB Semi
        createMatch('M28', 'LB Semi', 'M29', null, 'Winner M25', 'Winner M26'),
        // LB Final
        createMatch('M29', 'LB Final', 'M30', null, 'Winner M28', 'Loser M27'),
        // Grand Final
        createMatch('M30', 'Grand Final', null, null, 'Winner M27', 'Winner M29'),
    ];

    await initializeBracket(data);
    alert("Bracket Initialized in Firestore!");
  };

  // --- AUTO SEEDING ---
  const handleAutoSeed = async () => {
    if (teams.length < 2) return alert("Need at least 2 teams to seed!");
    if (!confirm("This will overwrite the first round matches with current teams. Continue?")) return;

    const seedMap = [
        { id: 'M1', t1: 0, t2: 15 },
        { id: 'M2', t1: 7, t2: 8 },
        { id: 'M3', t1: 4, t2: 11 },
        { id: 'M4', t1: 3, t2: 12 },
        { id: 'M5', t1: 5, t2: 10 },
        { id: 'M6', t1: 2, t2: 13 },
        { id: 'M7', t1: 6, t2: 9 },
        { id: 'M8', t1: 1, t2: 14 },
    ];

    for (const map of seedMap) {
        const team1 = teams[map.t1]?.name || null;
        const team2 = teams[map.t2]?.name || null;
        await updateMatch(map.id, { team1, team2 });
    }
    alert("Bracket Seeded with Teams!");
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
    setRosterData(team.roster && team.roster.length > 0 ? team.roster : [{ name: '', rank: '', discord: '' }]);
    setActiveTab('teams'); 
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
        `https://www.googleapis.com/youtube/v3/search?part=id&type=video&eventType=live&q=${encodeURIComponent(hashtag)}&key=${YOUTUBE_API_KEY}&maxResults=10`
      );
      const data = await res.json();
      
      if (data.items && data.items.length > 0) {
         const videoIds = data.items.map(item => item.id.videoId).join(',');
         const details = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
         );
         const detailsData = await details.json();
         
         setFoundStreams(detailsData.items.map(item => ({
            id: item.id,
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

  // --- REGISTRATION LOGIC ---
  const filteredRegistrations = useMemo(() => {
    if (tierFilter === 'All') return registrations;
    if (tierFilter === 'Captains') return registrations.filter(r => r.isCaptain);
    return registrations.filter(r => r.tier === tierFilter);
  }, [registrations, tierFilter]);

  const tierOptions = ['Unassigned', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'];

  const autoAssignTiers = async () => {
    if(!confirm("This will overwrite tiers for ALL registrations based on their Peak Rank. Continue?")) return;
    
    const getTierFromRank = (rank) => {
        const r = rank.toLowerCase();
        if (r.includes('radiant') || r.includes('immortal')) return 'Tier 1';
        if (r.includes('ascendant') || r.includes('diamond')) return 'Tier 2';
        if (r.includes('platinum') || r.includes('gold')) return 'Tier 3';
        return 'Tier 4'; 
    };

    let count = 0;
    for (const player of registrations) {
        const newTier = getTierFromRank(player.peakRank);
        if (player.tier !== newTier) {
            await assignTier(player.id, newTier);
            count++;
        }
    }
    alert(`Updated tiers for ${count} players.`);
  };

  // --- SITE CONFIG LOGIC ---
  const toggleConfig = (key) => {
    updateSiteConfig({ [key]: !siteConfig[key] });
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;

  if (!user) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-8 rounded-lg w-full max-w-md backdrop-blur-md">
          <h2 className="text-2xl font-bold uppercase mb-6 text-[#ff4655] text-center">Admin Login</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          
          <input 
            type="email" 
            className="w-full bg-black/50 border border-white/20 p-3 text-white mb-4 focus:outline-none focus:border-[#ff4655] transition"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input 
            type="password" 
            className="w-full bg-black/50 border border-white/20 p-3 text-white mb-4 focus:outline-none focus:border-[#ff4655] transition"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button className="bg-[#ff4655] hover:bg-[#d93542] text-white font-bold py-3 px-6 w-full uppercase tracking-widest transition">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      
      {/* HEADER & LOGOUT */}
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-black text-white uppercase">Admin Dashboard</h1>
         <div className="flex gap-4 items-center">
            <button onClick={handleLogout} className="text-gray-400 hover:text-white underline text-sm">
                Logout ({user.email})
            </button>
         </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex gap-4 mb-8 border-b border-white/10 overflow-x-auto">
        {['registrations', 'teams', 'bracket', 'streams', 'site config'].map(tab => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 text-sm font-bold uppercase tracking-widest transition border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-[#ff4655] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
            {tab}
            </button>
        ))}
      </div>

      {/* TAB CONTENT: REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-lg mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-4 mb-6 gap-4">
            <h2 className="text-2xl font-black uppercase">
              <span className="text-[#ff4655]">01 //</span> Player Registrations ({registrations.length})
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              <button 
                  onClick={autoAssignTiers}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded uppercase font-bold hover:bg-blue-500 mr-4"
              >
                  Auto-Assign Tiers
              </button>
              {['All', 'Captains', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`text-xs px-3 py-1 rounded uppercase font-bold transition ${tierFilter === t ? 'bg-[#ff4655] text-white' : 'bg-white/10 hover:bg-white/20 text-gray-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-200 uppercase bg-black/40 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">IDs</th>
                  <th className="px-4 py-3">Rank (Peak)</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center italic">No registrations found for this filter.</td>
                  </tr>
                ) : filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-bold text-white">
                      {reg.name}
                      {reg.youtubeLink && <a href={reg.youtubeLink} target="_blank" className="ml-2 text-[#ff4655] text-[10px] border border-[#ff4655] px-1 rounded hover:bg-[#ff4655] hover:text-white">YT</a>}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="text-gray-300">Val: {reg.valorantId}</div>
                      <div className="text-gray-500">Disc: {reg.discordId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${reg.currentRank.includes('Radiant') ? 'text-yellow-400' : 'text-white'}`}>{reg.currentRank}</span>
                      <span className="text-xs text-gray-500 ml-1 block">Peak: {reg.peakRank}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={reg.tier || 'Unassigned'} 
                        onChange={(e) => assignTier(reg.id, e.target.value)}
                        className="bg-black border border-white/20 text-xs p-1 rounded focus:border-[#ff4655] outline-none w-24"
                      >
                        {tierOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => assignCaptain(reg.id, !reg.isCaptain)}
                        className={`text-xs px-2 py-1 rounded font-bold uppercase border transition w-20 ${reg.isCaptain ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'border-gray-700 text-gray-600 hover:border-white hover:text-white'}`}
                      >
                        {reg.isCaptain ? 'Captain' : 'Player'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {reg.status === 'pending' ? (
                        <button 
                          onClick={() => updatePlayerStatus(reg.id, 'approved')}
                          className="text-xs bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-xs text-green-500 font-bold uppercase">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TEAMS */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
          <div className="bg-white/5 border border-white/10 p-6 rounded-lg h-fit">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <h2 className="text-2xl font-black uppercase">
                <span className="text-[#ff4655]">02 //</span> Teams
              </h2>
              {editingId && (
                <button onClick={handleCancelEdit} className="text-xs text-gray-400 hover:text-white underline">
                  Cancel Edit
                </button>
              )}
            </div>
            
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

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Current Teams ({teams.length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {teams.map((team) => (
                  <div key={team.id} className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5 hover:border-white/20 transition">
                    <div>
                      <span className="text-sm text-white font-bold block">{team.name}</span>
                      <span className="text-xs text-gray-500">{team.roster ? team.roster.length : 0} Players</span>
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
          <div className="text-gray-500 text-sm p-4 italic">
             Manage your official teams here. You can also form teams from registered players later.
          </div>
        </div>
      )}

      {/* TAB CONTENT: BRACKET */}
      {activeTab === 'bracket' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-lg animate-fade-in-up">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
            <h2 className="text-2xl font-black uppercase">
              <span className="text-[#ff4655]">03 //</span> Bracket Management
            </h2>
            <div className="flex gap-4">
               <button onClick={handleAutoSeed} className="text-xs text-[#ff4655] border border-[#ff4655] px-3 py-1 rounded hover:bg-[#ff4655] hover:text-white uppercase transition">
                  Auto-Seed Bracket
               </button>
               <button onClick={handleResetBracket} className="text-xs text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white uppercase transition">
                  Reset Bracket Data
               </button>
            </div>
          </div>

          {matches.length === 0 && <p className="text-red-500 text-sm">Bracket Empty. Click Reset Bracket above.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[800px] overflow-y-auto custom-scrollbar p-2">
            {matches.sort((a,b) => parseInt(a.id.replace('M','')) - parseInt(b.id.replace('M',''))).map((match) => (
              <div key={match.id} className="bg-black/40 border border-white/10 p-4 rounded">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono text-gray-500">{match.id}</span>
                  <span className="text-xs font-bold uppercase text-[#ff4655]">
                     {match.name}
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                  <div className="flex flex-col gap-1">
                     <div className="flex gap-1">
                       <select 
                         className="bg-black border border-white/20 text-white text-xs p-1 rounded w-24"
                         value={match.team1 || ""}
                         onChange={(e) => updateMatch(match.id, { team1: e.target.value || null })}
                       >
                         <option value="">{match.source1 || "Select Team"}</option>
                         {teams.map(t => (
                           <option key={t.id} value={t.name}>{t.name}</option>
                         ))}
                       </select>
                     </div>
                     
                     {match.team1 && (
                       <button 
                         onClick={() => updateMatch(match.id, { winner: match.team1 })}
                         className={`text-[10px] px-2 py-1 rounded transition ${match.winner === match.team1 ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-green-600'}`}
                       >
                         Winner
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
                     <div className="flex gap-1 justify-end">
                       <select 
                         className="bg-black border border-white/20 text-white text-xs p-1 rounded w-24"
                         value={match.team2 || ""}
                         onChange={(e) => updateMatch(match.id, { team2: e.target.value || null })}
                       >
                         <option value="">{match.source2 || "Select Team"}</option>
                         {teams.map(t => (
                           <option key={t.id} value={t.name}>{t.name}</option>
                         ))}
                       </select>
                     </div>

                     {match.team2 && (
                       <button 
                         onClick={() => updateMatch(match.id, { winner: match.team2 })}
                         className={`text-[10px] px-2 py-1 rounded transition ${match.winner === match.team2 ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-green-600'}`}
                       >
                         Winner
                       </button>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: STREAMS */}
      {activeTab === 'streams' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-lg animate-fade-in-up">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
            <h2 className="text-2xl font-black uppercase">
              <span className="text-[#ff4655]">04 //</span> Live Broadcast
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {['main', 'pov1', 'pov2'].map(slot => (
              <div key={slot} className="bg-black/40 border border-white/10 p-3 rounded relative">
                <span className="absolute top-2 right-2 text-[10px] text-[#ff4655] font-bold uppercase border border-[#ff4655] px-1 rounded">
                  {slot === 'main' ? 'Main Stream' : slot === 'pov1' ? 'POV 1' : 'POV 2'}
                </span>
                {streamSettings && streamSettings[slot] ? (
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

          <div className="mb-4 flex gap-4">
            <button 
              onClick={scanStreams} 
              disabled={scanning}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded font-bold uppercase tracking-widest transition"
            >
              {scanning ? "Scanning..." : "Scan YouTube Streams"}
            </button>
          </div>

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
      )}

      {/* TAB CONTENT: SITE CONFIG */}
      {activeTab === 'site config' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-lg animate-fade-in-up">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
            <h2 className="text-2xl font-black uppercase">
              <span className="text-[#ff4655]">05 //</span> Site Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(siteConfig).map(key => (
              <div key={key} className="flex justify-between items-center bg-black/40 p-4 rounded border border-white/5">
                <span className="text-sm font-bold uppercase text-white">{key.replace('show', '')} Page/Link</span>
                <button 
                  onClick={() => toggleConfig(key)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${siteConfig[key] ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${siteConfig[key] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 italic">
            Toggling these off will hide the link from the navigation bar.
          </p>
        </div>
      )}

    </div>
  );
}