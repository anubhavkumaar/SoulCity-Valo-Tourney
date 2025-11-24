"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy
} from 'firebase/firestore';

const TournamentContext = createContext();

export const TournamentProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [registrations, setRegistrations] = useState([]); 
  const [streamSettings, setStreamSettings] = useState({
    hashtag: 'lifeinsoulcity',
    main: null,
    pov1: null,
    pov2: null
  });
  // Site Config State with defaults
  const [siteConfig, setSiteConfig] = useState({
    showHome: true,
    showBracket: true,
    showTeams: true,
    showStreams: true,
    showRegister: true,
    showAdmin: true
  });
  const [loading, setLoading] = useState(true);

  // --- 1. INITIALIZATION & LISTENERS ---
  useEffect(() => {
    const unsubTeams = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsData);
    }, (error) => console.error("Teams listener error:", error));

    const unsubMatches = onSnapshot(collection(db, "matches"), (snapshot) => {
      if (!snapshot.empty) {
        const matchesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMatches(matchesData);
      }
    }, (error) => console.error("Matches listener error:", error));

    const unsubStreams = onSnapshot(doc(db, "settings", "streams"), (doc) => {
      if (doc.exists()) {
        setStreamSettings(doc.data());
      } else {
        setDoc(doc.ref, {
          hashtag: 'lifeinsoulcity',
          main: null, 
          pov1: null, 
          pov2: null
        }).catch(e => console.warn("Could not init stream settings:", e));
      }
    }, (error) => console.error("Stream settings listener error:", error));

    // NEW: Listener for Site Config
    const unsubSiteConfig = onSnapshot(doc(db, "settings", "siteConfig"), (doc) => {
      if (doc.exists()) {
        // Ensure we merge with defaults to prevent missing keys if DB is incomplete
        setSiteConfig(prev => ({ ...prev, ...doc.data() }));
      } else {
        const defaults = {
            showHome: true,
            showBracket: true,
            showTeams: true,
            showStreams: true,
            showRegister: true,
            showAdmin: true
        };
        setSiteConfig(defaults);
        setDoc(doc.ref, defaults).catch(e => console.warn("Could not init site config:", e));
      }
    }, (error) => console.error("Site config listener error:", error));

    const qRegistrations = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
    const unsubRegistrations = onSnapshot(qRegistrations, (snapshot) => {
      const regsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrations(regsData);
    }, (error) => console.error("Registrations listener error:", error));

    setLoading(false);

    return () => {
      unsubTeams();
      unsubMatches();
      unsubStreams();
      unsubRegistrations();
      unsubSiteConfig();
    };
  }, []);

  // --- 2. ACTIONS ---

  const updateSiteConfig = async (newConfig) => {
    try {
      const docRef = doc(db, "settings", "siteConfig");
      // Use setDoc with merge: true to safely update partial fields
      await setDoc(docRef, newConfig, { merge: true });
    } catch (error) {
      console.error("Error updating site config:", error);
      alert(`Action Failed: ${error.message}`);
    }
  };

  // ... (Rest of the actions remain identical) ...
  const registerPlayer = async (playerData) => {
    try {
      await addDoc(collection(db, "registrations"), {
        ...playerData,
        createdAt: new Date().toISOString(),
        status: 'pending', 
        tier: 'Unassigned', 
        isCaptain: false
      });
      return { success: true };
    } catch (error) {
      console.error("Error registering player:", error);
      return { success: false, error };
    }
  };

  const updatePlayerStatus = async (id, status) => {
    try {
      const playerRef = doc(db, "registrations", id);
      await updateDoc(playerRef, { status });
    } catch (error) {
      console.error("Error updating player status:", error);
      alert(`Action Failed: ${error.message}`);
    }
  };

  const assignTier = async (id, tier) => {
    try {
      const playerRef = doc(db, "registrations", id);
      await updateDoc(playerRef, { tier });
    } catch (error) {
      console.error("Error assigning tier:", error);
      alert(`Action Failed: ${error.message}`);
    }
  };

  const assignCaptain = async (id, isCaptain) => {
    try {
      const playerRef = doc(db, "registrations", id);
      await updateDoc(playerRef, { isCaptain });
    } catch (error) {
      console.error("Error assigning captain:", error);
      alert(`Action Failed: ${error.message}`);
    }
  };

  const addTeam = async (name, roster) => {
    try {
      await addDoc(collection(db, "teams"), { name, roster });
    } catch (error) {
      console.error("Error adding team:", error);
      alert(`Action Failed: ${error.message}`);
    }
  };

  const removeTeam = async (id) => {
    try {
      const teamRef = doc(db, "teams", id);
      const teamSnap = await getDoc(teamRef);
      const teamName = teamSnap.exists() ? teamSnap.data().name : null;

      await deleteDoc(teamRef);

      if (teamName) {
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
    } catch (error) {
      console.error("Error removing team:", error);
      alert(`Action Failed: ${error.message}`);
    }
  };

  const editTeam = async (id, newName, newRoster) => {
    try {
      const teamRef = doc(db, "teams", id);
      const teamSnap = await getDoc(teamRef);
      const oldName = teamSnap.exists() ? teamSnap.data().name : null;

      await updateDoc(teamRef, { name: newName, roster: newRoster });

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
    } catch (error) {
      console.error("Error editing team:", error);
      alert(`Action Failed: ${error.message}`);
    }
  };

  const initializeBracket = async (initialData) => {
    try {
      for (const match of initialData) {
        await setDoc(doc(db, "matches", match.id), match);
      }
    } catch (error) {
      console.error("Error initializing bracket:", error);
      alert(`Action Failed: ${error.message}`);
    }
  };

  const updateMatch = async (matchId, updates) => {
    try {
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, updates);

      const currentMatch = matches.find(m => m.id === matchId);
      if (!currentMatch) return;

      if (updates.winner) {
        const winner = updates.winner;
        const loser = winner === currentMatch.team1 ? currentMatch.team2 : currentMatch.team1;

        if (currentMatch.nextWin) {
          const nextMatchRef = doc(db, "matches", currentMatch.nextWin);
          const nextMatchSnap = await getDoc(nextMatchRef);
          if (nextMatchSnap.exists()) {
             const nextData = nextMatchSnap.data();
             let updatePayload = {};
             if (nextData.source1 && nextData.source1.includes(currentMatch.id)) updatePayload.team1 = winner;
             else if (nextData.source2 && nextData.source2.includes(currentMatch.id)) updatePayload.team2 = winner;
             
             if (Object.keys(updatePayload).length > 0) await updateDoc(nextMatchRef, updatePayload);
          }
        }

        if (currentMatch.nextLose && loser) {
           const nextLoseRef = doc(db, "matches", currentMatch.nextLose);
           const nextLoseSnap = await getDoc(nextLoseRef);
           if (nextLoseSnap.exists()) {
              const nextData = nextLoseSnap.data();
              let updatePayload = {};
              if (nextData.source1 && nextData.source1.includes(currentMatch.id)) updatePayload.team1 = loser;
              else if (nextData.source2 && nextData.source2.includes(currentMatch.id)) updatePayload.team2 = loser;
              if (Object.keys(updatePayload).length > 0) await updateDoc(nextLoseRef, updatePayload);
           }
        }
      }
    } catch (error) {
      console.error("Error updating match:", error);
      alert(`Action Failed: ${error.message}`);
    }
  };

  const updateStreamSettings = async (newSettings) => {
    try {
      const docRef = doc(db, "settings", "streams");
      await updateDoc(docRef, newSettings);
    } catch (error) {
      console.error("Error updating stream settings:", error);
      alert(`Action Failed: ${error.message}`);
    }
  };

  return (
    <TournamentContext.Provider value={{ 
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
      registerPlayer,
      updatePlayerStatus, 
      assignTier,
      assignCaptain,
      loading
    }}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => useContext(TournamentContext);