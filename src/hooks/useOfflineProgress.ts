import { useState, useEffect, useCallback } from 'react';
import { offlineStore, OfflineProgress } from '../lib/offline-storage';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';

export function useOfflineProgress() {
  const [progress, setProgress] = useState<OfflineProgress[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();

  const loadLocalData = useCallback(async () => {
    const data = await offlineStore.getAllProgress();
    setProgress(data);
  }, []);

  const syncWithFirestore = useCallback(async () => {
    if (!user) return;
    
    const pending = await offlineStore.getPendingSync();
    
    if (pending.length === 0) return;

    setIsSyncing(true);
    console.log("📡 Preparing sync payload for Firestore:", pending);

    try {
      const promises = pending.map(async (item) => {
        const docRef = doc(db, 'users', user.uid, 'progress', item.phraseId);
        await setDoc(docRef, {
          phraseId: item.phraseId,
          isFavorited: item.isFavorited,
          masteryScore: item.masteryScore,
          lastPracticedAt: item.lastPracticedAt,
          updatedAt: serverTimestamp()
        }, { merge: true });
      });

      await Promise.all(promises);

      const syncedIds = pending.map(p => p.phraseId);
      await offlineStore.markAsSynced(syncedIds);
      
      console.log("✅ Sync complete. Cloud database updated.");
      await loadLocalData();
    } catch (error) {
      console.error("❌ Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [loadLocalData, user]);

  const updateProgress = async (phraseId: string, data: Partial<OfflineProgress>) => {
    await offlineStore.saveProgress({ phraseId, ...data });
    await loadLocalData();
    
    if (navigator.onLine && user) {
      syncWithFirestore();
    }
  };

  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  // Initial cloud sync on login
  useEffect(() => {
    const pullFromCloud = async () => {
      if (!user) return;
      try {
        const progressRef = collection(db, 'users', user.uid, 'progress');
        const snapshot = await getDocs(progressRef);
        const cloudData = snapshot.docs.map(doc => doc.data() as OfflineProgress);
        
        for (const item of cloudData) {
          // Merge with local, preferring local if not synced
          await offlineStore.saveProgress(item);
        }
        await loadLocalData();
        await syncWithFirestore(); // push any pending local changes
      } catch (error) {
        console.error("Failed to pull from cloud", error);
      }
    };
    
    if (navigator.onLine) {
      pullFromCloud();
    }
  }, [user, loadLocalData, syncWithFirestore]);

  useEffect(() => {
    const handleOnline = () => {
      if (user) syncWithFirestore();
    };
    window.addEventListener('online', handleOnline);

    return () => window.removeEventListener('online', handleOnline);
  }, [syncWithFirestore, user]);

  return {
    progress,
    updateProgress,
    isSyncing,
    refresh: loadLocalData
  };
}
