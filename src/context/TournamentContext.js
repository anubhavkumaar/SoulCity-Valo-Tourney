"use client";
import { createContext, useContext, useState } from 'react';

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
  const [teams, setTeams] = useState(
    Array.from({ length: 16 }, (_, i) => ({ 
      id: `team-${i+1}`, 
      name: `Team ${i+1}`, 
      roster: [] 
    }))
  );

  // Helper to create match objects
  const createMatch = (id, name, nextWin, nextLose, src1, src2) => ({
    id, name, nextWin, nextLose, 
    source1: src1, source2: src2,
    team1: null, team2: null, score1: 0, score2: 0, winner: null
  });

  const initialMatches = [
    // --- WINNERS BRACKET ---
    { ...createMatch('M1', 'WB R1', 'M13', 'M9', 'Team 1', 'Team 16'), team1: 'Team 1', team2: 'Team 16' },
    { ...createMatch('M2', 'WB R1', 'M13', 'M9', 'Team 8', 'Team 9'), team1: 'Team 8', team2: 'Team 9' },
    { ...createMatch('M3', 'WB R1', 'M14', 'M10', 'Team 5', 'Team 12'), team1: 'Team 5', team2: 'Team 12' },
    { ...createMatch('M4', 'WB R1', 'M14', 'M10', 'Team 4', 'Team 13'), team1: 'Team 4', team2: 'Team 13' },
    { ...createMatch('M5', 'WB R1', 'M15', 'M11', 'Team 6', 'Team 11'), team1: 'Team 6', team2: 'Team 11' },
    { ...createMatch('M6', 'WB R1', 'M15', 'M11', 'Team 3', 'Team 14'), team1: 'Team 3', team2: 'Team 14' },
    { ...createMatch('M7', 'WB R1', 'M16', 'M12', 'Team 7', 'Team 10'), team1: 'Team 7', team2: 'Team 10' },
    { ...createMatch('M8', 'WB R1', 'M16', 'M12', 'Team 2', 'Team 15'), team1: 'Team 2', team2: 'Team 15' },

    // Round 2
    createMatch('M13', 'WB QF', 'M21', 'M20', 'Winner M1', 'Winner M2'),
    createMatch('M14', 'WB QF', 'M21', 'M19', 'Winner M3', 'Winner M4'),
    createMatch('M15', 'WB QF', 'M22', 'M18', 'Winner M5', 'Winner M6'),
    createMatch('M16', 'WB QF', 'M22', 'M17', 'Winner M7', 'Winner M8'),

    // Semis
    createMatch('M21', 'WB Semi', 'M27', 'M26', 'Winner M13', 'Winner M14'),
    createMatch('M22', 'WB Semi', 'M27', 'M25', 'Winner M15', 'Winner M16'),

    // Winners Final
    createMatch('M27', 'WB Final', 'M30', 'M29', 'Winner M21', 'Winner M22'),

    // --- LOSERS BRACKET ---
    createMatch('M9', 'LB R1', 'M17', null, 'Loser M1', 'Loser M2'),
    createMatch('M10', 'LB R1', 'M18', null, 'Loser M3', 'Loser M4'),
    createMatch('M11', 'LB R1', 'M19', null, 'Loser M5', 'Loser M6'),
    createMatch('M12', 'LB R1', 'M20', null, 'Loser M7', 'Loser M8'),

    createMatch('M17', 'LB R2', 'M23', null, 'Winner M9', 'Loser M16'),
    createMatch('M18', 'LB R2', 'M23', null, 'Winner M10', 'Loser M15'),
    createMatch('M19', 'LB R2', 'M24', null, 'Winner M11', 'Loser M14'),
    createMatch('M20', 'LB R2', 'M24', null, 'Winner M12', 'Loser M13'),

    createMatch('M23', 'LB R3', 'M25', null, 'Winner M17', 'Winner M18'),
    createMatch('M24', 'LB R3', 'M26', null, 'Winner M19', 'Winner M20'),

    createMatch('M25', 'LB R4', 'M28', null, 'Winner M23', 'Loser M22'),
    createMatch('M26', 'LB R4', 'M28', null, 'Winner M24', 'Loser M21'),

    createMatch('M28', 'LB Semi', 'M29', null, 'Winner M25', 'Winner M26'),
    createMatch('M29', 'LB Final', 'M30', null, 'Winner M28', 'Loser M27'),

    // --- GRAND FINAL ---
    createMatch('M30', 'Grand Final', null, null, 'Winner M27', 'Winner M29'),
  ];

  const [matches, setMatches] = useState(initialMatches);

  const updateMatch = (matchId, updates) => {
    setMatches(prev => {
      const current = prev.find(m => m.id === matchId);
      if(!current) return prev;
      
      const newMatches = prev.map(m => m.id === matchId ? { ...m, ...updates } : m);

      // Auto Advance Logic
      if (updates.winner) {
        // Advance Winner
        if (current.nextWin) {
          const nextM = newMatches.find(m => m.id === current.nextWin);
          if (nextM) {
             const slot = !nextM.team1 || nextM.team1.includes('Winner') || nextM.team1.includes('Loser') ? 'team1' : 'team2';
             // Only update if not already set to this winner
             if (nextM[slot] !== updates.winner) {
                const idx = newMatches.findIndex(m => m.id === current.nextWin);
                newMatches[idx] = { ...newMatches[idx], [slot]: updates.winner };
             }
          }
        }
        // Drop Loser
        if (current.nextLose) {
          const loser = updates.winner === current.team1 ? current.team2 : current.team1;
          if (loser) {
             const nextM = newMatches.find(m => m.id === current.nextLose);
             if (nextM) {
               const slot = !nextM.team1 || nextM.team1.includes('Winner') || nextM.team1.includes('Loser') ? 'team1' : 'team2';
               const idx = newMatches.findIndex(m => m.id === current.nextLose);
               newMatches[idx] = { ...newMatches[idx], [slot]: loser };
             }
          }
        }
      }
      return newMatches;
    });
  };

  const addTeam = (name, roster) => {
     const newTeam = { id: `team-${Date.now()}`, name, roster };
     setTeams(prev => [...prev, newTeam]);
  };

  const removeTeam = (id) => {
    // 1. Get the team name before deleting
    const teamToRemove = teams.find(t => t.id === id);
    const nameToRemove = teamToRemove ? teamToRemove.name : null;

    setTeams(prev => prev.filter(t => t.id !== id));

    // 2. Clear this team from the bracket if they exist there
    if (nameToRemove) {
      setMatches(prev => prev.map(m => {
        let update = { ...m };
        if (update.team1 === nameToRemove) update.team1 = null;
        if (update.team2 === nameToRemove) update.team2 = null;
        if (update.winner === nameToRemove) update.winner = null;
        return update;
      }));
    }
  };

  const editTeam = (id, newName, newRoster) => {
    // 1. Get the Old Name
    const teamToEdit = teams.find(t => t.id === id);
    const oldName = teamToEdit ? teamToEdit.name : null;

    // 2. Update Team List
    setTeams(prev => prev.map(t => t.id === id ? { ...t, name: newName, roster: newRoster } : t));

    // 3. Update Name in Matches (Propagation)
    if (oldName && oldName !== newName) {
      setMatches(prev => prev.map(m => {
        let update = { ...m };
        // Replace in Slots
        if (update.team1 === oldName) update.team1 = newName;
        if (update.team2 === oldName) update.team2 = newName;
        // Replace in Winner (if already won)
        if (update.winner === oldName) update.winner = newName;
        // Replace in Source (if it was a seeded source)
        if (update.source1 === oldName) update.source1 = newName;
        if (update.source2 === oldName) update.source2 = newName;
        
        return update;
      }));
    }
  };

  return (
    <TournamentContext.Provider value={{ teams, matches, updateMatch, addTeam, removeTeam, editTeam }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => useContext(TournamentContext);