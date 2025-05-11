'use server';

import { db } from '@/lib/firebase';
import type { LeaderboardEntry } from '@/types';
import { collection, query, where, getDocs, doc, setDoc, orderBy, limit, serverTimestamp, runTransaction } from 'firebase/firestore';

const LEADERBOARD_COLLECTION = 'leaderboard';

export async function submitPlayerScore(
  playerId: string,
  playerName: string,
  score: number
): Promise<{ success: boolean; message?: string; finalPlayerName?: string; finalPlayerId?: string }> {
  if (!playerId || !playerName.trim() || typeof score !== 'number') {
    return { success: false, message: 'Invalid input provided.' };
  }

  const trimmedPlayerName = playerName.trim();

  try {
    await runTransaction(db, async (transaction) => {
      // Check if the desired name is taken by another player
      const nameQuery = query(collection(db, LEADERBOARD_COLLECTION), where('name', '==', trimmedPlayerName));
      const nameQuerySnapshot = await transaction.get(nameQuery);
      
      let nameTakenByOther = false;
      nameQuerySnapshot.forEach((doc) => {
        if (doc.data().playerId !== playerId) {
          nameTakenByOther = true;
        }
      });

      if (nameTakenByOther) {
        throw new Error(`Player name "${trimmedPlayerName}" is already taken by another player.`);
      }

      // Check if the current player (by playerId) already has an entry
      const playerDocRef = doc(db, LEADERBOARD_COLLECTION, playerId); // Use playerId as document ID for simplicity
      const playerDocSnapshot = await transaction.get(playerDocRef);

      if (playerDocSnapshot.exists()) {
        // Player exists, update their name (if different and available) and score
        const existingData = playerDocSnapshot.data();
        if (existingData.name !== trimmedPlayerName) {
          // This case is covered by the name check above. If we reach here, the new name is available or it's their current name.
          // If they are changing name, their old name entry (if they had one under a different ID system) is implicitly handled
          // by using playerId as the document ID.
        }
        transaction.set(playerDocRef, {
          name: trimmedPlayerName,
          score: score,
          playerId: playerId,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } else {
        // New player or player ID not found, create a new entry.
        // The name availability check has already passed.
        transaction.set(playerDocRef, {
          name: trimmedPlayerName,
          score: score,
          playerId: playerId,
          updatedAt: serverTimestamp(),
        });
      }
    });

    return { success: true, finalPlayerName: trimmedPlayerName, finalPlayerId: playerId };
  } catch (error: any) {
    console.error('Error submitting player score:', error);
    return { success: false, message: error.message || 'Failed to submit score. Please try again.' };
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const q = query(collection(db, LEADERBOARD_COLLECTION), orderBy('score', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);
    const leaderboard: LeaderboardEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        id: doc.id, // This is the playerId
        name: data.name,
        score: data.score,
        playerId: data.playerId,
        // isCurrentUser will be determined on the client-side
      });
    });
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}
