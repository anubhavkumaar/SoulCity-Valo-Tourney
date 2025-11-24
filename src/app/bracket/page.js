"use client";
import { useTournament } from "@/context/TournamentContext";

// Component for a Single Match Card
const MatchCard = ({ match, noConnector = false }) => {
  if (!match) return null;

  // If no team is set, show the source placeholder (e.g. "Winner M1")
  const t1 = match.team1 || match.source1 || 'TBD';
  const t2 = match.team2 || match.source2 || 'TBD';
  
  const isPlaceholder1 = t1?.includes('Winner') || t1?.includes('Loser') || t1?.includes('Team') || t1 === 'TBD';
  const isPlaceholder2 = t2?.includes('Winner') || t2?.includes('Loser') || t2?.includes('Team') || t2 === 'TBD';

  return (
    <div className={`match-card ${noConnector ? 'no-connector' : ''}`}>
      <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
        <span>{match.id}</span>
      </div>
      
      {/* Team 1 Row */}
      <div className={`flex justify-between items-center py-1 border-b border-white/10 ${match.winner === match.team1 && match.team1 ? 'text-[#ff4655] font-bold' : ''}`}>
        <span className={`truncate text-sm pr-2 ${isPlaceholder1 ? 'text-gray-500 italic text-xs' : 'text-white'}`}>
          {t1}
        </span>
        <span className="text-white font-mono text-xs">{match.score1}</span>
      </div>

      {/* Team 2 Row */}
      <div className={`flex justify-between items-center py-1 ${match.winner === match.team2 && match.team2 ? 'text-[#ff4655] font-bold' : ''}`}>
         <span className={`truncate text-sm pr-2 ${isPlaceholder2 ? 'text-gray-500 italic text-xs' : 'text-white'}`}>
          {t2}
        </span>
        <span className="text-white font-mono text-xs">{match.score2}</span>
      </div>
    </div>
  );
};

// Component to Group 2 matches (or 1) to create the Elbow connector
const BracketPair = ({ topMatch, botMatch }) => {
  return (
    <div className="match-pair">
      {topMatch && <MatchCard match={topMatch} />}
      {botMatch && <MatchCard match={botMatch} />}
    </div>
  );
};

export default function BracketPage() {
  const { matches, siteConfig, loading } = useTournament();

  if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;

  // Check if page is enabled
  if (siteConfig && !siteConfig.showBracket) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0f1923] text-white text-center p-4">
            <h1 className="text-4xl font-black uppercase text-[#ff4655] mb-4">Access Restricted</h1>
            <p className="text-gray-400">The Tournament Bracket is currently hidden.</p>
        </div>
    );
  }

  const getM = (id) => matches.find(m => m.id === id);

  if (!matches || matches.length === 0) return <div className="text-white p-10 text-center">Loading Bracket or No Data Initialized...</div>;

  return (
    <div className="min-h-screen bg-[#0f1923] p-8 overflow-x-auto custom-scrollbar">
      <div className="min-w-[1600px] pb-20">
        
        {/* --- WINNERS BRACKET --- */}
        <h2 className="text-2xl font-black uppercase text-white mb-6 border-l-4 border-[#ff4655] pl-4">
          Winners Bracket
        </h2>
        
        <div className="flex flex-row">
          {/* Round 1 (8 Matches, 4 Pairs) */}
          <div className="bracket-round">
            <h3 className="text-center text-gray-500 text-xs uppercase mb-4">Round of 16</h3>
            <BracketPair topMatch={getM('M1')} botMatch={getM('M2')} />
            <BracketPair topMatch={getM('M3')} botMatch={getM('M4')} />
            <BracketPair topMatch={getM('M5')} botMatch={getM('M6')} />
            <BracketPair topMatch={getM('M7')} botMatch={getM('M8')} />
          </div>

          {/* Round 2 (4 Matches, 2 Pairs) */}
          <div className="bracket-round mx-8">
            <h3 className="text-center text-gray-500 text-xs uppercase mb-4">Quarter Finals</h3>
            <BracketPair topMatch={getM('M13')} botMatch={getM('M14')} />
            <BracketPair topMatch={getM('M15')} botMatch={getM('M16')} />
          </div>

          {/* Semis (2 Matches, 1 Pair) */}
          <div className="bracket-round mx-8">
             <h3 className="text-center text-gray-500 text-xs uppercase mb-4">Semi Finals</h3>
             <div className="flex-1 flex flex-col justify-center">
               <BracketPair topMatch={getM('M21')} botMatch={getM('M22')} />
             </div>
          </div>

           {/* Winners Final */}
           <div className="bracket-round mx-8">
             <h3 className="text-center text-[#ff4655] text-xs uppercase mb-4">Winners Final</h3>
             <div className="flex-1 flex flex-col justify-center">
               <MatchCard match={getM('M27')} noConnector />
             </div>
          </div>
        </div>

        {/* --- LOSERS BRACKET --- */}
        <h2 className="text-2xl font-black uppercase text-white mt-16 mb-6 border-l-4 border-gray-500 pl-4">
          Losers Bracket
        </h2>

        <div className="flex flex-row">
           {/* LB R1 */}
           <div className="bracket-round">
             <h3 className="text-center text-gray-500 text-xs uppercase mb-4">Round 1</h3>
             <BracketPair topMatch={getM('M9')} botMatch={getM('M10')} />
             <BracketPair topMatch={getM('M11')} botMatch={getM('M12')} />
           </div>

           {/* LB R2 */}
           <div className="bracket-round mx-8">
              <h3 className="text-center text-gray-500 text-xs uppercase mb-4">Round 2</h3>
              <BracketPair topMatch={getM('M17')} botMatch={getM('M18')} />
              <BracketPair topMatch={getM('M19')} botMatch={getM('M20')} />
           </div>

           {/* LB R3 */}
           <div className="bracket-round mx-8">
              <h3 className="text-center text-gray-500 text-xs uppercase mb-4">Round 3</h3>
              <div className="flex-1 flex flex-col justify-center gap-10">
                 <BracketPair topMatch={getM('M23')} botMatch={getM('M24')} />
              </div>
           </div>

           {/* LB R4 */}
           <div className="bracket-round mx-8">
              <h3 className="text-center text-gray-500 text-xs uppercase mb-4">Round 4</h3>
              <div className="flex-1 flex flex-col justify-center">
                <BracketPair topMatch={getM('M25')} botMatch={getM('M26')} />
              </div>
           </div>

           {/* LB Semi */}
           <div className="bracket-round mx-8">
              <h3 className="text-center text-gray-500 text-xs uppercase mb-4">Semi Final</h3>
              <div className="flex-1 flex flex-col justify-center">
                <MatchCard match={getM('M28')} />
              </div>
           </div>

           {/* LB Final */}
           <div className="bracket-round mx-8">
              <h3 className="text-center text-gray-500 text-xs uppercase mb-4">Losers Final</h3>
              <div className="flex-1 flex flex-col justify-center">
                <MatchCard match={getM('M29')} noConnector />
              </div>
           </div>
        </div>

        {/* --- GRAND FINAL --- */}
        <div className="mt-16 flex justify-center">
          <div className="w-96 text-center">
            <h2 className="text-3xl font-black uppercase text-yellow-500 mb-4 tracking-tighter glow-text">
              Grand Final
            </h2>
            <MatchCard match={getM('M30')} noConnector />
          </div>
        </div>

      </div>
    </div>
  );
}