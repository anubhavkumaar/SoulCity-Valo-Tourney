import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from "firebase/firestore";

const STANDINGS_COLLECTION = "standings";

export const getStandings = async () => {
    try {
        const q = query(collection(db, STANDINGS_COLLECTION), orderBy("points", "desc"), orderBy("roundDiff", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting standings:", error);
        return [];
    }
};

export const updateTeamStats = async (teamId, stats) => {
    try {
        const teamRef = doc(db, STANDINGS_COLLECTION, teamId);
        await updateDoc(teamRef, stats);
    } catch (error) {
        console.error("Error updating team stats:", error);
    }
};

export const initializeStandings = async (teams) => {
    // Helper to seed standings if empty
    const current = await getStandings();
    if (current.length === 0) {
        for (const team of teams) {
            await addDoc(collection(db, STANDINGS_COLLECTION), {
                teamId: team.id,
                teamName: team.name,
                played: 0,
                won: 0,
                lost: 0,
                draw: 0,
                points: 0,
                roundDiff: 0
            });
        }
    }
};
