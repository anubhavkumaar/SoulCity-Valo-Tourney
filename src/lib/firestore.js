import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

const TEAMS_COLLECTION = "teams";
const BRACKET_COLLECTION = "bracket";

// Team Operations
export const getTeams = async () => {
    const q = query(collection(db, TEAMS_COLLECTION), orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addTeam = async (teamData) => {
    return await addDoc(collection(db, TEAMS_COLLECTION), teamData);
};

export const updateTeam = async (id, teamData) => {
    const teamRef = doc(db, TEAMS_COLLECTION, id);
    return await updateDoc(teamRef, teamData);
};

export const deleteTeam = async (id) => {
    const teamRef = doc(db, TEAMS_COLLECTION, id);
    return await deleteDoc(teamRef);
};

// Bracket Operations
// We'll store the entire bracket structure in a single document or a few documents
export const getBracket = async () => {
    const querySnapshot = await getDocs(collection(db, BRACKET_COLLECTION));
    if (querySnapshot.empty) return null;
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
};

export const saveBracket = async (bracketData) => {
    // Check if bracket exists
    const snapshot = await getDocs(collection(db, BRACKET_COLLECTION));
    if (snapshot.empty) {
        return await addDoc(collection(db, BRACKET_COLLECTION), bracketData);
    } else {
        const docId = snapshot.docs[0].id;
        const bracketRef = doc(db, BRACKET_COLLECTION, docId);
        return await updateDoc(bracketRef, bracketData);
    }
};
