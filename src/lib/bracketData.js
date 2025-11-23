export const INITIAL_BRACKET_DATA = {
    rounds: [
        // Winner Bracket
        {
            id: "wb_r1",
            name: "Upper Round 1",
            matches: [
                { id: 1, nextMatchId: 9, nextMatchSlot: "team1", loserMatchId: 16, loserMatchSlot: "team1", team1: "Team 1", team2: "Team 16", score1: 0, score2: 0 },
                { id: 2, nextMatchId: 9, nextMatchSlot: "team2", loserMatchId: 16, loserMatchSlot: "team2", team1: "Team 8", team2: "Team 9", score1: 0, score2: 0 },
                { id: 3, nextMatchId: 10, nextMatchSlot: "team1", loserMatchId: 17, loserMatchSlot: "team1", team1: "Team 5", team2: "Team 12", score1: 0, score2: 0 },
                { id: 4, nextMatchId: 10, nextMatchSlot: "team2", loserMatchId: 17, loserMatchSlot: "team2", team1: "Team 4", team2: "Team 13", score1: 0, score2: 0 },
                { id: 5, nextMatchId: 11, nextMatchSlot: "team1", loserMatchId: 18, loserMatchSlot: "team1", team1: "Team 6", team2: "Team 11", score1: 0, score2: 0 },
                { id: 6, nextMatchId: 11, nextMatchSlot: "team2", loserMatchId: 18, loserMatchSlot: "team2", team1: "Team 3", team2: "Team 14", score1: 0, score2: 0 },
                { id: 7, nextMatchId: 12, nextMatchSlot: "team1", loserMatchId: 19, loserMatchSlot: "team1", team1: "Team 7", team2: "Team 10", score1: 0, score2: 0 },
                { id: 8, nextMatchId: 12, nextMatchSlot: "team2", loserMatchId: 19, loserMatchSlot: "team2", team1: "Team 2", team2: "Team 15", score1: 0, score2: 0 },
            ]
        },
        {
            id: "wb_r2",
            name: "Upper Quarterfinals",
            matches: [
                { id: 9, nextMatchId: 13, nextMatchSlot: "team1", loserMatchId: 22, loserMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 },
                { id: 10, nextMatchId: 13, nextMatchSlot: "team2", loserMatchId: 23, loserMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 },
                { id: 11, nextMatchId: 14, nextMatchSlot: "team1", loserMatchId: 20, loserMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 },
                { id: 12, nextMatchId: 14, nextMatchSlot: "team2", loserMatchId: 21, loserMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 },
            ]
        },
        {
            id: "wb_r3",
            name: "Upper Semifinals",
            matches: [
                { id: 13, nextMatchId: 15, nextMatchSlot: "team1", loserMatchId: 27, loserMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 },
                { id: 14, nextMatchId: 15, nextMatchSlot: "team2", loserMatchId: 26, loserMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 },
            ]
        },
        {
            id: "wb_final",
            name: "Upper Final",
            matches: [
                { id: 15, nextMatchId: 30, nextMatchSlot: "team1", loserMatchId: 29, loserMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 },
            ]
        },
        // Loser Bracket
        {
            id: "lb_r1",
            name: "Lower Round 1",
            matches: [
                { id: 16, nextMatchId: 20, nextMatchSlot: "team1", team1: null, team2: null, score1: 0, score2: 0 }, // Losers of 1 & 2
                { id: 17, nextMatchId: 21, nextMatchSlot: "team1", team1: null, team2: null, score1: 0, score2: 0 }, // Losers of 3 & 4
                { id: 18, nextMatchId: 22, nextMatchSlot: "team1", team1: null, team2: null, score1: 0, score2: 0 }, // Losers of 5 & 6
                { id: 19, nextMatchId: 23, nextMatchSlot: "team1", team1: null, team2: null, score1: 0, score2: 0 }, // Losers of 7 & 8
            ]
        },
        {
            id: "lb_r2",
            name: "Lower Round 2",
            matches: [
                { id: 20, nextMatchId: 24, nextMatchSlot: "team1", team1: null, team2: null, score1: 0, score2: 0 }, // Winner 16 vs Loser 11
                { id: 21, nextMatchId: 24, nextMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 }, // Winner 17 vs Loser 12
                { id: 22, nextMatchId: 25, nextMatchSlot: "team1", team1: null, team2: null, score1: 0, score2: 0 }, // Winner 18 vs Loser 9
                { id: 23, nextMatchId: 25, nextMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 }, // Winner 19 vs Loser 10
            ]
        },
        {
            id: "lb_r3",
            name: "Lower Round 3",
            matches: [
                { id: 24, nextMatchId: 26, nextMatchSlot: "team1", team1: null, team2: null, score1: 0, score2: 0 },
                { id: 25, nextMatchId: 27, nextMatchSlot: "team1", team1: null, team2: null, score1: 0, score2: 0 },
            ]
        },
        {
            id: "lb_r4",
            name: "Lower Semifinals",
            matches: [
                { id: 26, nextMatchId: 28, nextMatchSlot: "team1", team1: null, team2: null, score1: 0, score2: 0 }, // Winner 24 vs Loser 14
                { id: 27, nextMatchId: 28, nextMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 }, // Winner 25 vs Loser 13
            ]
        },
        {
            id: "lb_r5",
            name: "Lower Final",
            matches: [
                { id: 28, nextMatchId: 29, nextMatchSlot: "team1", team1: null, team2: null, score1: 0, score2: 0 },
            ]
        },
        {
            id: "lb_final",
            name: "Consolation Final",
            matches: [
                { id: 29, nextMatchId: 30, nextMatchSlot: "team2", team1: null, team2: null, score1: 0, score2: 0 }, // Winner 28 vs Loser 15
            ]
        },
        // Grand Final
        {
            id: "grand_final",
            name: "Grand Final",
            matches: [
                { id: 30, nextMatchId: null, team1: null, team2: null, score1: 0, score2: 0 }, // Winner 15 vs Winner 29
            ]
        }
    ]
};
