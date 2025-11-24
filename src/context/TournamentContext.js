"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, getDoc 
} from 'firebase/firestore';

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [streamSettings, setStreamSettings] = useState({
    hashtag: 'lifeinsoulcity',
    main: null,
    pov1: null,
    pov2: null
  });
  const [loading, setLoading] = useState(true);

  // --- 1. INITIALIZATION & LISTENERS ---
  useEffect(() => {
    // Listener for Teams
    const unsubTeams = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsData);
    });

    // Listener for Bracket Matches
    // We store matches in a single document 'bracket/main' to ensure atomic updates, 
    // or a collection 'matches'. For simplicity given the bracket structure, 
    // let's assume a collection 'matches' where each doc is a match.
    // However, to keep it consistent with previous logic, let's use a collection.
    const unsubMatches = onSnapshot(collection(db, "matches"), (snapshot) => {
      if (snapshot.empty) {
        // If empty, we might need to initialize it (handled by admin or separate init script)
        console.log("No matches found in Firestore.");
      } else {
        const matchesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort matches by their ID (M1, M2...) to keep order consistent if needed
        // But usually UI handles order.
        setMatches(matchesData);
      }
    });

    // Listener for Stream Settings
    const unsubStreams = onSnapshot(doc(db, "settings", "streams"), (doc) => {
      if (doc.exists()) {
        setStreamSettings(doc.data());
      } else {
        // Initialize defaults if missing
        setDoc(doc.ref, {
          hashtag: 'lifeinsoulcity',
          main: null, 
          pov1: null, 
          pov2: null
        });
      }
    });

    setLoading(false);

    return () => {
      unsubTeams();
      unsubMatches();
      unsubStreams();
    };
  }, []);

  // --- 2. ACTIONS (WRITE TO FIRESTORE) ---

  // TEAMS
  const addTeam = async (name, roster) => {
    await addDoc(collection(db, "teams"), { name, roster });
  };

  const removeTeam = async (id) => {
    const teamRef = doc(db, "teams", id);
    const teamSnap = await getDoc(teamRef);
    const teamName = teamSnap.exists() ? teamSnap.data().name : null;

    await deleteDoc(teamRef);

    // Cleanup bracket if team is removed
    if (teamName) {
      // This requires updating multiple match docs. 
      // In a real app, use a batch or transaction.
      // Here we iterate matches in state to find which to update.
      matches.forEach(async (m) => {
        let updates = {};
        if (m.team1 === teamName) updates.team1 = null;
        if (m.team2 === teamName) updates.team2 = null;
        if (m.winner === teamName) updates.winner = null;
        
        if (Object.keys(updates).length > 0) {
          await updateDoc(doc(db, "matches", m.id), updates);
        }
      });
    }
  };

  const editTeam = async (id, newName, newRoster) => {
    const teamRef = doc(db, "teams", id);
    const teamSnap = await getDoc(teamRef);
    const oldName = teamSnap.exists() ? teamSnap.data().name : null;

    await updateDoc(teamRef, { name: newName, roster: newRoster });

    // Propagate name change to bracket
    if (oldName && oldName !== newName) {
      matches.forEach(async (m) => {
        let updates = {};
        if (m.team1 === oldName) updates.team1 = newName;
        if (m.team2 === oldName) updates.team2 = newName;
        if (m.winner === oldName) updates.winner = newName;
        if (m.source1 === oldName) updates.source1 = newName;
        if (m.source2 === oldName) updates.source2 = newName;

        if (Object.keys(updates).length > 0) {
          await updateDoc(doc(db, "matches", m.id), updates);
        }
      });
    }
  };

  // BRACKET
  // This function initializes the bracket in Firestore if it's empty.
  // Can be called from Admin panel.
  const initializeBracket = async (initialData) => {
    const batch = []; // Firestore batch not used here for simplicity, doing loop
    for (const match of initialData) {
      // We use setDoc with specific ID (M1, M2) to make querying easier
      await setDoc(doc(db, "matches", match.id), match);
    }
  };

  const updateMatch = async (matchId, updates) => {
    const matchRef = doc(db, "matches", matchId);
    
    // 1. Update the specific match
    await updateDoc(matchRef, updates);

    // 2. Handle Auto-Advance Logic (Winner/Loser progression)
    // We need to read the current match state to know who won/lost exactly
    // But we can use the local 'matches' state since it's synced.
    const currentMatch = matches.find(m => m.id === matchId);
    if (!currentMatch) return;

    // If setting a winner
    if (updates.winner) {
      const winner = updates.winner;
      // Calculate loser based on current state + update
      // Note: 'currentMatch' might be stale compared to 'updates' if they changed score & winner simultaneously.
      // Safest is to assume updates.winner is the source of truth.
      const loser = winner === currentMatch.team1 ? currentMatch.team2 : currentMatch.team1;

      // Advance Winner
      if (currentMatch.nextWin) {
        const nextM = matches.find(m => m.id === currentMatch.nextWin);
        if (nextM) {
           // Determine slot. Usually Team 1 comes from top/previous match source 1
           // Simplified logic: If nextM.team1 is empty or placeholder, fill it. 
           // Better logic: Check 'source' fields if available, or rely on ID mappings.
           // For this specific structure, let's rely on checking if the slot is empty or needs replacement.
           
           // However, strictly following a bracket structure (M1->M13), we know M1 feeds into M13 Team 1.
           // To do this generically, we'd need a `nextWinSlot` field in data.
           // Let's assume the `initialMatches` structure in `BracketLib` or `TournamentContext` defined these.
           // Since we are using `initialMatches` array previously, let's rely on that logic but we need to read the *next match* to update it.
           
           // We will simply try to find which slot `currentMatch.id` feeds into.
           // Since we don't have `nextWinSlot` stored, we have to infer or update the data structure.
           // **Crucial Fix:** Add `nextWinSlot` and `nextLoseSlot` to data structure in `initializeBracket`.
           
           // For now, let's assume the data in Firestore has these fields if we initialized it correctly.
           // If not, we update the target match blindly? No, that overwrites.
           // Let's use the logic: 
           // M1 -> M13 Team 1
           // M2 -> M13 Team 2
           // We need to fetch the target match document and update it.
           
           // Since we can't easily change the data schema on the fly, let's do a robust update:
           // We'll read the Next Match from Firestore.
           const nextMatchRef = doc(db, "matches", currentMatch.nextWin);
           const nextMatchSnap = await getDoc(nextMatchRef);
           
           if (nextMatchSnap.exists()) {
             const nextData = nextMatchSnap.data();
             // Logic: If I am the 'source1' for that match, I go to 'team1'.
             // We stored 'source1': 'Winner M1' in previous code.
             let updatePayload = {};
             if (nextData.source1 && nextData.source1.includes(currentMatch.id)) {
                updatePayload.team1 = winner;
             } else if (nextData.source2 && nextData.source2.includes(currentMatch.id)) {
                updatePayload.team2 = winner;
             }
             
             if (Object.keys(updatePayload).length > 0) {
               await updateDoc(nextMatchRef, updatePayload);
             }
           }
        }
      }

      // Advance Loser
      if (currentMatch.nextLose && loser) {
         const nextLoseRef = doc(db, "matches", currentMatch.nextLose);
         const nextLoseSnap = await getDoc(nextLoseRef);
         if (nextLoseSnap.exists()) {
            const nextData = nextLoseSnap.data();
            let updatePayload = {};
            if (nextData.source1 && nextData.source1.includes(currentMatch.id)) {
               updatePayload.team1 = loser;
            } else if (nextData.source2 && nextData.source2.includes(currentMatch.id)) {
               updatePayload.team2 = loser;
            }
            if (Object.keys(updatePayload).length > 0) {
               await updateDoc(nextLoseRef, updatePayload);
            }
         }
      }
    }
  };

  // STREAMS
  const updateStreamSettings = async (newSettings) => {
    const docRef = doc(db, "settings", "streams");
    await updateDoc(docRef, newSettings);
  };

  return (
    <TournamentContext.Provider value={{ 
      teams, 
      matches, 
      updateMatch, 
      addTeam, 
      removeTeam, 
      editTeam,
      streamSettings,
      updateStreamSettings,
      initializeBracket, // Exposed for Admin to reset/init
      loading
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => useContext(TournamentContext);