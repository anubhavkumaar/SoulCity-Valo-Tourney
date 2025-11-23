"use client";
import { DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import { useState, useEffect } from "react";
import { getBracket } from "@/lib/firestore";
import { INITIAL_BRACKET_DATA } from "@/lib/bracketData";

export default function Bracket() {
    const [matches, setMatches] = useState([]);
    const [width, setWidth] = useState(1000);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWidth(window.innerWidth);
            const handleResize = () => setWidth(window.innerWidth);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // FOR DEMO: Force sample data to avoid Firebase permission issues blocking the view
            console.log("Using sample bracket data");
            const transformed = transformData(INITIAL_BRACKET_DATA);
            setMatches(transformed);
            setLoading(false);

            /* 
            // Original Fetch Logic (Restorable later)
            try {
                console.log("Fetching bracket data...");
                const fetchPromise = getBracket();
                const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 2000));
                
                const data = await Promise.race([fetchPromise, timeoutPromise]);
                
                console.log("Raw data (or null if timeout):", data);
                const rawData = data || INITIAL_BRACKET_DATA;
                const transformed = transformData(rawData);
                setMatches(transformed);
            } catch (error) {
                console.error("Error loading bracket:", error);
                // Fallback on error
                setMatches(transformData(INITIAL_BRACKET_DATA));
            } finally {
                setLoading(false);
            }
            */
        };
        fetchData();
    }, []);

    const transformData = (data) => {
        const allMatches = [];

        if (!data || !data.rounds) return [];

        data.rounds.forEach(round => {
            round.matches.forEach(m => {
                // Determine status
                let state = 'SCHEDULED';
                if (m.score1 > 0 || m.score2 > 0) state = 'SCORE_DONE';
                // if (m.team1 && m.team2) state = 'SCHEDULED'; // Ready to play
                // if (m.score1 || m.score2) state = 'SCORE_DONE'; // Simple check

                // Participants
                const participants = [
                    {
                        id: m.team1 || 'TBD1',
                        resultText: m.score1?.toString() || '0',
                        isWinner: m.score1 > m.score2,
                        status: null,
                        name: m.team1 || 'TBD'
                    },
                    {
                        id: m.team2 || 'TBD2',
                        resultText: m.score2?.toString() || '0',
                        isWinner: m.score2 > m.score1,
                        status: null,
                        name: m.team2 || 'TBD'
                    }
                ];

                allMatches.push({
                    id: m.id,
                    nextMatchId: m.nextMatchId,
                    tournamentRoundText: round.name,
                    startTime: '',
                    state: state,
                    participants: participants
                });
            });
        });

        return allMatches;
    };

    const CustomMatch = ({ match, onMatchClick, onPartyClick, topText, bottomText, ...props }) => {
        return (
            <div className="flex flex-col bg-[#1f272b] border border-gray-600 rounded min-w-[200px] shadow-lg">
                <div className="bg-[#0f1923] text-gray-400 text-[10px] px-2 py-1 uppercase tracking-wider border-b border-gray-600 flex justify-between">
                    <span>{match.tournamentRoundText}</span>
                    <span>M{match.id}</span>
                </div>
                <div className="flex flex-col">
                    {match.participants.map((participant, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center px-3 py-2 border-b border-gray-700 last:border-0 ${participant.isWinner ? 'bg-gradient-to-r from-[#ff4655]/20 to-transparent' : ''}`}
                        >
                            <span className={`text-sm font-medium truncate ${participant.name !== 'TBD' ? "text-white" : "text-gray-600 italic"}`}>
                                {participant.name}
                            </span>
                            <span className={`font-bold font-mono ${participant.isWinner ? "text-[#ff4655]" : "text-gray-500"}`}>
                                {participant.resultText}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return <div className="text-white text-center mt-20 text-2xl animate-pulse">Loading Bracket Data...</div>;

    return (
        <div className="overflow-hidden h-[800px] w-full bg-[#0f1923] border border-gray-800 rounded-lg relative">
            {matches.length > 0 ? (
                <DoubleEliminationBracket
                    matches={matches}
                    matchComponent={CustomMatch}
                    svgWrapper={({ children, ...props }) => (
                        <SVGViewer width={width} height={800} background="#0f1923" SVGBackground="#0f1923" {...props}>
                            {children}
                        </SVGViewer>
                    )}
                />
            ) : (
                <div className="text-white text-center mt-20">No matches found.</div>
            )}
        </div>
    );
}
