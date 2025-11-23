"use client";
import { useState, useEffect } from "react";
import { getTeams, addTeam, deleteTeam } from "@/lib/firestore";
import { FaTrash, FaPlus } from "react-icons/fa";

export default function TeamManager() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTeamName, setNewTeamName] = useState("");
    const [players, setPlayers] = useState([{ name: "", rank: "", discord: "" }]);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        const data = await getTeams();
        setTeams(data);
        setLoading(false);
    };

    const handleAddPlayerField = () => {
        setPlayers([...players, { name: "", rank: "", discord: "" }]);
    };

    const handlePlayerChange = (index, field, value) => {
        const newPlayers = [...players];
        newPlayers[index][field] = value;
        setPlayers(newPlayers);
    };

    const handleAddTeam = async (e) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        const teamData = {
            name: newTeamName,
            players: players.filter(p => p.name.trim() !== ""), // Filter empty players
            createdAt: new Date().toISOString()
        };

        await addTeam(teamData);
        setNewTeamName("");
        setPlayers([{ name: "", rank: "", discord: "" }]);
        fetchTeams();
    };

    const handleDeleteTeam = async (id) => {
        if (confirm("Are you sure you want to delete this team?")) {
            await deleteTeam(id);
            fetchTeams();
        }
    };

    return (
        <div>
            <h2 className="text-2xl text-white mb-6">Teams List ({teams.length}/16)</h2>

            {/* Add Team Form */}
            <div className="mb-10 bg-[#0f1923] p-6 rounded border border-gray-700">
                <h3 className="text-[#ff4655] text-xl mb-4">Add New Team</h3>
                <form onSubmit={handleAddTeam}>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-1">Team Name</label>
                        <input
                            type="text"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="w-full bg-[#1f272b] border border-gray-600 text-white p-2 rounded focus:border-[#ff4655] outline-none"
                            placeholder="Enter Team Name"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-2">Roster (Name, Rank, Discord)</label>
                        {players.map((player, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Player Name"
                                    value={player.name}
                                    onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                                    className="flex-1 bg-[#1f272b] border border-gray-600 text-white p-2 rounded text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Rank"
                                    value={player.rank}
                                    onChange={(e) => handlePlayerChange(index, "rank", e.target.value)}
                                    className="w-24 bg-[#1f272b] border border-gray-600 text-white p-2 rounded text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Discord ID"
                                    value={player.discord}
                                    onChange={(e) => handlePlayerChange(index, "discord", e.target.value)}
                                    className="w-32 bg-[#1f272b] border border-gray-600 text-white p-2 rounded text-sm"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddPlayerField}
                            className="text-xs text-[#ff4655] hover:text-white mt-1 flex items-center gap-1"
                        >
                            <FaPlus size={10} /> Add Player Slot
                        </button>
                    </div>

                    <button type="submit" className="valo-btn w-full md:w-auto">
                        Add Team
                    </button>
                </form>
            </div>

            {/* Teams List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                    <div key={team.id} className="bg-[#0f1923] p-4 rounded border border-gray-700 relative group">
                        <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FaTrash />
                        </button>
                        <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                        <div className="space-y-1">
                            {team.players && team.players.map((p, i) => (
                                <div key={i} className="text-sm text-gray-400 flex justify-between">
                                    <span>{p.name}</span>
                                    <span className="text-xs bg-gray-800 px-1 rounded">{p.rank}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {teams.length === 0 && !loading && (
                    <p className="text-gray-500 col-span-full text-center py-10">No teams added yet.</p>
                )}
            </div>
        </div>
    );
}
