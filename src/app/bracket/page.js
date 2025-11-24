"use client";
import { useTournament } from "@/context/TournamentContext";

// Single Match Card Component
const MatchCard = ({ match, styleType = "default" }) => {
  if (!match) return <div className="w-64 h-24 opacity-0" />; // Spacer if match missing

  const t1 = match.team1 || match.source1 || 'TBD';
  const t2 = match.team2 || match.source2 || 'TBD';
  
  const isPlaceholder1 = t1?.includes('Winner') || t1?.includes('Loser') || t1?.includes('Seed') || t1 === 'TBD';
  const isPlaceholder2 = t2?.includes('Winner') || t2?.includes('Loser') || t2?.includes('Seed') || t2 === 'TBD';

  const hasWinner = !!match.winner;
  const isReady = !isPlaceholder1 && !isPlaceholder2;
  const inProgress = isReady && !hasWinner && (match.score1 > 0 || match.score2 > 0);

  // Border color
  let borderColor = "border-gray-700";
  if (hasWinner) borderColor = "border-[#ff4655]";
  else if (inProgress) borderColor = "border-yellow-500";
  else if (isReady) borderColor = "border-green-500";

  const getRowClass = (teamName) => {
    if (!hasWinner) return "text-white";
    if (match.winner === teamName) return "bg-green-900/20 text-green-400 font-bold";
    return "text-gray-500";
  };

  return (
    <div className={`relative w-64 bg-[#1c2733] border-l-4 ${borderColor} shadow-lg rounded-r sm:w-56 md:w-64 shrink-0 z-10`}>
      <div className="flex justify-between px-3 py-1 border-b border-white/5 text-[10px] text-gray-400 uppercase tracking-wider bg-black/20">
        <span>{match.id}</span>
        {hasWinner && <span className="text-[#ff4655]">Final</span>}
        {inProgress && <span className="text-yellow-500 animate-pulse">Live</span>}
      </div>
      
      {/* Team 1 */}
      <div className={`flex justify-between items-center px-3 py-2 border-b border-white/5 ${getRowClass(match.team1)}`}>
        <span className="truncate text-sm max-w-[140px]">{t1}</span>
        <span className="font-mono text-sm">{match.score1}</span>
      </div>

      {/* Team 2 */}
      <div className={`flex justify-between items-center px-3 py-2 ${getRowClass(match.team2)}`}>
        <span className="truncate text-sm max-w-[140px]">{t2}</span>
        <span className="font-mono text-sm">{match.score2}</span>
      </div>
    </div>
  );
};

// Connector Component (Draws the lines)
const Connector = ({ type }) => {
    // type: 'straight' | 'elbow-up' | 'elbow-down' | 'tee'
    const color = "border-gray-600";
    
    if (type === 'horizontal') {
        return <div className={`w-8 h-[2px] bg-gray-600`}></div>
    }

    // Vertical bracket connector ( ] shape )
    return (
        <div className={`w-8 border-r-2 ${color} absolute right-[-2rem] top-1/2 -translate-y-1/2 h-full`}></div>
    );
};

export default function BracketPage() {
  const { matches, siteConfig, loading } = useTournament();

  if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  if (siteConfig && !siteConfig.showBracket) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0f1923] text-white text-center p-4">
            <h1 className="text-4xl font-black uppercase text-[#ff4655] mb-4">Access Restricted</h1>
            <p className="text-gray-400">The Tournament Bracket is currently hidden.</p>
        </div>
    );
  }

  const getM = (id) => matches.find(m => m.id === id);
  if (!matches || matches.length === 0) return <div className="text-white p-10 text-center">Loading Bracket...</div>;

  // --- BRACKET STRUCTURE ---
  // We build "Blocks" where 2 matches feed into 1 next match.
  // To achieve proper alignment, we use a flex column layout where the "Next Match" 
  // is centered vertically relative to the "Previous Matches".

  const MatchColumn = ({ title, children }) => (
    <div className="flex flex-col gap-8">
        <h3 className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">{title}</h3>
        <div className="flex flex-col justify-around h-full">
            {children}
        </div>
    </div>
  );

  // Renders a Match with a connecting line to the right
  const MatchNode = ({ matchId, hasNext = true }) => (
      <div className="relative flex items-center my-4">
          <MatchCard match={getM(matchId)} />
          {hasNext && <div className="w-8 h-[2px] bg-gray-600 shrink-0"></div>}
      </div>
  );

  // A block that contains two Source Matches and one Destination Match
  // BUT, standard HTML structure is column-based. 
  // Let's stick to absolute positioning logic via CSS Grid or simple Flex with spacers.
  // Actually, the simplest way to get perfect lines is to render columns and ensure heights align.
  
  // Let's use a specific CSS approach for the tree lines.
  // "r1-match" feeds "r2-match".
  
  return (
    <div className="min-h-screen bg-[#0f1923] p-10 overflow-x-auto custom-scrollbar">
      <div className="min-w-max pb-20">
        <h2 className="text-3xl font-black uppercase text-white mb-10 border-l-8 border-[#ff4655] pl-6 tracking-tighter">
          Winners Bracket
        </h2>

        {/* FLEX CONTAINER FOR ROUNDS */}
        <div className="flex flex-row">
            
            {/* ROUND 1 (16 Teams -> 8 Matches) */}
            <div className="flex flex-col justify-around gap-8 mr-10">
                <div className="text-center text-gray-500 text-xs uppercase mb-2">Round of 16</div>
                {/* Pair 1 */}
                <div className="flex flex-col gap-4 relative">
                    <MatchCard match={getM('M1')} />
                    <MatchCard match={getM('M2')} />
                    {/* Bracket Line */}
                    <div className="absolute right-[-20px] top-[45px] bottom-[45px] w-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] top-1/2 w-[20px] h-[2px] bg-gray-600"></div>
                    {/* Connector from matches to vertical line */}
                    <div className="absolute right-[-20px] top-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] bottom-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                </div>
                {/* Pair 2 */}
                <div className="flex flex-col gap-4 relative">
                    <MatchCard match={getM('M3')} />
                    <MatchCard match={getM('M4')} />
                    <div className="absolute right-[-20px] top-[45px] bottom-[45px] w-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] top-1/2 w-[20px] h-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] top-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] bottom-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                </div>
                {/* Pair 3 */}
                <div className="flex flex-col gap-4 relative">
                    <MatchCard match={getM('M5')} />
                    <MatchCard match={getM('M6')} />
                    <div className="absolute right-[-20px] top-[45px] bottom-[45px] w-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] top-1/2 w-[20px] h-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] top-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] bottom-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                </div>
                {/* Pair 4 */}
                <div className="flex flex-col gap-4 relative">
                    <MatchCard match={getM('M7')} />
                    <MatchCard match={getM('M8')} />
                    <div className="absolute right-[-20px] top-[45px] bottom-[45px] w-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] top-1/2 w-[20px] h-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] top-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                    <div className="absolute right-[-20px] bottom-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                </div>
            </div>

            {/* ROUND 2 (Quarter Finals) */}
            <div className="flex flex-col justify-around mr-10 pt-8 pb-8">
                <div className="text-center text-gray-500 text-xs uppercase mb-2">Quarter Finals</div>
                {/* Group 1 (M13, M14) */}
                <div className="flex flex-col gap-32 relative"> 
                     {/* M13 */}
                     <div className="relative">
                        <MatchCard match={getM('M13')} />
                        {/* Line coming from left (handled by prev column), Line going right */}
                     </div>
                     {/* M14 */}
                     <div className="relative">
                        <MatchCard match={getM('M14')} />
                     </div>
                     {/* Bracket Line connecting these two */}
                     <div className="absolute right-[-20px] top-[45px] bottom-[45px] w-[2px] bg-gray-600"></div>
                     <div className="absolute right-[-20px] top-1/2 w-[20px] h-[2px] bg-gray-600"></div>
                     
                     <div className="absolute right-[-20px] top-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                     <div className="absolute right-[-20px] bottom-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                </div>

                {/* Group 2 (M15, M16) */}
                <div className="flex flex-col gap-32 relative mt-16">
                     <div className="relative">
                        <MatchCard match={getM('M15')} />
                     </div>
                     <div className="relative">
                        <MatchCard match={getM('M16')} />
                     </div>
                     <div className="absolute right-[-20px] top-[45px] bottom-[45px] w-[2px] bg-gray-600"></div>
                     <div className="absolute right-[-20px] top-1/2 w-[20px] h-[2px] bg-gray-600"></div>
                     
                     <div className="absolute right-[-20px] top-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                     <div className="absolute right-[-20px] bottom-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                </div>
            </div>

            {/* ROUND 3 (Semi Finals) */}
            <div className="flex flex-col justify-around mr-10 pt-16 pb-16">
                <div className="text-center text-gray-500 text-xs uppercase mb-2">Semi Finals</div>
                <div className="flex flex-col gap-64 relative">
                    <MatchCard match={getM('M21')} />
                    <MatchCard match={getM('M22')} />

                    {/* Bracket Line */}
                     <div className="absolute right-[-20px] top-[45px] bottom-[45px] w-[2px] bg-gray-600"></div>
                     <div className="absolute right-[-20px] top-1/2 w-[20px] h-[2px] bg-gray-600"></div>
                     
                     <div className="absolute right-[-20px] top-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                     <div className="absolute right-[-20px] bottom-[45px] w-[20px] h-[2px] bg-gray-600"></div>
                </div>
            </div>

            {/* ROUND 4 (Winners Final) */}
            <div className="flex flex-col justify-center">
                <div className="text-center text-[#ff4655] text-xs uppercase mb-2 font-bold">Winners Final</div>
                <MatchCard match={getM('M27')} />
            </div>
        </div>

        {/* --- LOSERS BRACKET (Simplified View) --- */}
        <h2 className="text-3xl font-black uppercase text-white mt-24 mb-10 border-l-8 border-gray-500 pl-6 tracking-tighter">
            Losers Bracket
        </h2>
        <div className="flex flex-row gap-12 items-center">
             {/* Just displaying them in columns for now, complex lines are harder here */}
             <div className="flex flex-col gap-6">
                 <h3 className="text-gray-500 text-xs uppercase text-center">Round 1</h3>
                 <MatchCard match={getM('M9')} />
                 <MatchCard match={getM('M10')} />
                 <MatchCard match={getM('M11')} />
                 <MatchCard match={getM('M12')} />
             </div>
             <div className="flex flex-col gap-6">
                 <h3 className="text-gray-500 text-xs uppercase text-center">Round 2</h3>
                 <MatchCard match={getM('M17')} />
                 <MatchCard match={getM('M18')} />
                 <MatchCard match={getM('M19')} />
                 <MatchCard match={getM('M20')} />
             </div>
             <div className="flex flex-col gap-16">
                 <h3 className="text-gray-500 text-xs uppercase text-center">Round 3</h3>
                 <MatchCard match={getM('M23')} />
                 <MatchCard match={getM('M24')} />
             </div>
             <div className="flex flex-col gap-16">
                 <h3 className="text-gray-500 text-xs uppercase text-center">Round 4</h3>
                 <MatchCard match={getM('M25')} />
                 <MatchCard match={getM('M26')} />
             </div>
             <div className="flex flex-col justify-center">
                 <h3 className="text-gray-500 text-xs uppercase text-center mb-2">Semi Final</h3>
                 <MatchCard match={getM('M28')} />
             </div>
             <div className="flex flex-col justify-center">
                 <h3 className="text-gray-500 text-xs uppercase text-center mb-2">Losers Final</h3>
                 <MatchCard match={getM('M29')} />
             </div>
        </div>

        {/* GRAND FINAL */}
         <div className="mt-20 flex justify-center">
            <div className="text-center">
                <h2 className="text-2xl text-[#ff4655] font-black uppercase mb-4">Grand Final</h2>
                <div className="transform scale-125">
                    <MatchCard match={getM('M30')} />
                </div>
            </div>
         </div>

      </div>
    </div>
  );
}