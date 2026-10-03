import localforage from 'localforage';

localforage.config({
  name: 'JamboSwahili',
  storeName: 'user_progress_v1'
});

export interface OfflineProgress {
  phraseId: string;
  isFavorited: boolean;
  masteryScore: number;
  lastPracticedAt: string;
  synced: boolean;
}

export const offlineStore = {
  async saveProgress(update: Partial<OfflineProgress> & { phraseId: string }) {
    const existing: OfflineProgress | null = await localforage.getItem(update.phraseId);
    
    const newData: OfflineProgress = {
      phraseId: update.phraseId,
      isFavorited: update.isFavorited ?? existing?.isFavorited ?? false,
      masteryScore: update.masteryScore ?? existing?.masteryScore ?? 0,
      lastPracticedAt: new Date().toISOString(),
      synced: false
    };

    return await localforage.setItem(update.phraseId, newData);
  },

  async getAllProgress(): Promise<OfflineProgress[]> {
    const keys = await localforage.keys();
    const items = await Promise.all(keys.map(key => localforage.getItem(key)));
    return items as OfflineProgress[];
  },

  async getPendingSync(): Promise<OfflineProgress[]> {
    const all = await this.getAllProgress();
    return all.filter(item => !item.synced);
  },

  async markAsSynced(phraseIds: string[]) {
    for (const id of phraseIds) {
      const item: OfflineProgress | null = await localforage.getItem(id);
      if (item) {
        await localforage.setItem(id, { ...item, synced: true });
      }
    }
  }
};
