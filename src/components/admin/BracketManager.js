"use client";
import { useState, useEffect } from "react";
import { getBracket, saveBracket, getTeams } from "@/lib/firestore";
import { INITIAL_BRACKET_DATA } from "@/lib/bracketData";

export default function BracketManager() {
    const [bracket, setBracket] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [bracketData, teamsData] = await Promise.all([
            getBracket(),
            getTeams()
        ]);

        if (bracketData) {
            setBracket(bracketData);
        } else {
            setBracket(INITIAL_BRACKET_DATA);
        }
        setTeams(teamsData);
        setLoading(false);
    };

    const handleTeamAssignment = (matchId, slot, teamName) => {
        const newBracket = { ...bracket };
        const round = newBracket.rounds.find(r => r.matches.some(m => m.id === matchId));
        const match = round.matches.find(m => m.id === matchId);

        match[slot] = teamName;
        setBracket(newBracket);
    };

    const handleScoreUpdate = (matchId, score1, score2) => {
        const newBracket = { ...bracket };
        const round = newBracket.rounds.find(r => r.matches.some(m => m.id === matchId));
        const match = round.matches.find(m => m.id === matchId);

        match.score1 = parseInt(score1) || 0;
        match.score2 = parseInt(score2) || 0;

        // Auto-advance logic
        const winner = match.score1 > match.score2 ? match.team1 : (match.score2 > match.score1 ? match.team2 : null);
        const loser = match.score1 > match.score2 ? match.team2 : (match.score2 > match.score1 ? match.team1 : null);

        if (winner) {
            // Advance Winner
            if (match.nextMatchId) {
                const nextRound = newBracket.rounds.find(r => r.matches.some(m => m.id === match.nextMatchId));
                const nextMatch = nextRound.matches.find(m => m.id === match.nextMatchId);
                if (match.nextMatchSlot) {
                    nextMatch[match.nextMatchSlot] = winner;
                }
            }

            // Advance Loser (if applicable)
            if (match.loserMatchId && loser) {
                const loserRound = newBracket.rounds.find(r => r.matches.some(m => m.id === match.loserMatchId));
                const loserMatch = loserRound.matches.find(m => m.id === match.loserMatchId);
                if (match.loserMatchSlot) {
                    loserMatch[match.loserMatchSlot] = loser;
                }
            }
        }

        setBracket(newBracket);
    };

    const saveChanges = async () => {
        setSaving(true);
        await saveBracket(bracket);
        setSaving(false);
        alert("Bracket saved successfully!");
    };

    const resetBracket = async () => {
        if (confirm("Are you sure? This will reset the entire bracket.")) {
            setBracket(INITIAL_BRACKET_DATA);
            await saveBracket(INITIAL_BRACKET_DATA);
        }
    };

    if (loading) return <div>Loading Bracket...</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-white">Manage Bracket</h2>
                <div className="space-x-4">
                    <button onClick={resetBracket} className="text-red-500 hover:text-red-400">Reset Bracket</button>
                    <button onClick={saveChanges} disabled={saving} className="valo-btn">
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {bracket.rounds.map((round) => (
                    <div key={round.id} className="bg-[#0f1923] p-4 rounded border border-gray-700">
                        <h3 className="text-[#ff4655] font-bold mb-4">{round.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {round.matches.map((match) => (
                                <div key={match.id} className="bg-[#1f272b] p-3 rounded border border-gray-600">
                                    <div className="text-xs text-gray-500 mb-2">Match #{match.id}</div>

                                    {/* Team 1 */}
                                    <div className="flex justify-between items-center mb-2">
                                        {round.id === "wb_r1" ? (
                                            <select
                                                value={match.team1 || ""}
                                                onChange={(e) => handleTeamAssignment(match.id, "team1", e.target.value)}
                                                className="bg-[#0f1923] text-white text-sm p-1 rounded w-32"
                                            >
                                                <option value="">Select Team</option>
                                                {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                            </select>
                                        ) : (
                                            <span className={`text-sm ${match.team1 ? "text-white" : "text-gray-600"}`}>
                                                {match.team1 || "TBD"}
                                            </span>
                                        )}
                                        <input
                                            type="number"
                                            value={match.score1}
                                            onChange={(e) => handleScoreUpdate(match.id, e.target.value, match.score2)}
                                            className="w-12 bg-[#0f1923] text-white text-center rounded border border-gray-600"
                                        />
                                    </div>

                                    {/* Team 2 */}
                                    <div className="flex justify-between items-center">
                                        {round.id === "wb_r1" ? (
                                            <select
                                                value={match.team2 || ""}
                                                onChange={(e) => handleTeamAssignment(match.id, "team2", e.target.value)}
                                                className="bg-[#0f1923] text-white text-sm p-1 rounded w-32"
                                            >
                                                <option value="">Select Team</option>
                                                {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                            </select>
                                        ) : (
                                            <span className={`text-sm ${match.team2 ? "text-white" : "text-gray-600"}`}>
                                                {match.team2 || "TBD"}
                                            </span>
                                        )}
                                        <input
                                            type="number"
                                            value={match.score2}
                                            onChange={(e) => handleScoreUpdate(match.id, match.score1, e.target.value)}
                                            className="w-12 bg-[#0f1923] text-white text-center rounded border border-gray-600"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
