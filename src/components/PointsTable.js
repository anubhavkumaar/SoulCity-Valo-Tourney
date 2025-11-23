"use client";
import { useState, useEffect } from "react";
import { getStandings } from "@/lib/standings";

export default function PointsTable() {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
            const mockStandings = [
                { id: '1', teamName: 'Team Soul', played: 5, won: 5, lost: 0, points: 15, roundDiff: 25 },
                { id: '2', teamName: 'Team GodLike', played: 5, won: 4, lost: 1, points: 12, roundDiff: 18 },
                { id: '3', teamName: 'Team XSpark', played: 5, won: 3, lost: 2, points: 9, roundDiff: 10 },
                { id: '4', teamName: 'Team 8Bit', played: 5, won: 2, lost: 3, points: 6, roundDiff: -5 },
                { id: '5', teamName: 'Team Entity', played: 5, won: 1, lost: 4, points: 3, roundDiff: -12 },
                { id: '6', teamName: 'Team Blind', played: 5, won: 0, lost: 5, points: 0, roundDiff: -36 },
            ];

            try {
                const data = await getStandings();
                if (data && data.length > 0) {
                    setStandings(data);
                } else {
                    setStandings(mockStandings);
                }
            } catch (e) {
                console.error("Error loading standings:", e);
                setStandings(mockStandings);
            } finally {
                setLoading(false);
            }
        };
        fetchStandings();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-[#ff4655] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="table-wrapper bg-[#141b2d]">
            <table>
                <thead>
                    <tr>
                        <th className="text-left">Pos</th>
                        <th className="text-left">Team</th>
                        <th className="text-center">P</th>
                        <th className="text-center">W</th>
                        <th className="text-center">L</th>
                        <th className="text-center">RD</th>
                        <th className="text-center">Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((team, index) => (
                        <tr key={team.id}>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-[#ffd60a] text-black' :
                                            index === 1 ? 'bg-gray-400 text-black' :
                                                index === 2 ? 'bg-[#cd7f32] text-black' :
                                                    'bg-white/5 text-gray-400'
                                        }`}>
                                        {index + 1}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#ff4655] to-[#e63946] rounded-lg flex items-center justify-center text-sm font-bold">
                                        {team.teamName.substring(5, 7).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-white">{team.teamName}</span>
                                </div>
                            </td>
                            <td className="text-center text-gray-300">{team.played}</td>
                            <td className="text-center">
                                <span className="text-[#00d9a3] font-semibold">{team.won}</span>
                            </td>
                            <td className="text-center">
                                <span className="text-[#ff4655] font-semibold">{team.lost}</span>
                            </td>
                            <td className="text-center">
                                <span className={team.roundDiff > 0 ? 'text-[#00d9a3]' : team.roundDiff < 0 ? 'text-[#ff4655]' : 'text-gray-400'}>
                                    {team.roundDiff > 0 ? '+' : ''}{team.roundDiff}
                                </span>
                            </td>
                            <td className="text-center">
                                <span className="text-white font-bold text-lg">{team.points}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
