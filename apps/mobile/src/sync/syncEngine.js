import { getDatabase } from '../database/sqlite';
import { apiClient } from '../api/client';

export const syncEngine = {
  queueOperation: async ({ entityType, entityId, operation, payload }) => {
    try {
      const db = await getDatabase();
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.runAsync(
        `INSERT INTO sync_queue (id, entity_type, entity_id, operation, payload, created_at, retry_count, status)
         VALUES (?, ?, ?, ?, ?, ?, 0, 'PENDING')`,
        [id, entityType, entityId || '', operation, JSON.stringify(payload), Date.now()]
      );
      return id;
    } catch (e) {
      console.warn('Error queuing sync operation:', e);
      throw e;
    }
  },

  getPendingItems: async () => {
    try {
      const db = await getDatabase();
      return await db.getAllAsync(`SELECT * FROM sync_queue WHERE status = 'PENDING' ORDER BY created_at ASC`);
    } catch (e) {
      console.warn('Error fetching pending sync items:', e);
      return [];
    }
  },

  processSyncQueue: async () => {
    const pending = await syncEngine.getPendingItems();
    if (!pending.length) return { processed: 0, failed: 0 };

    const db = await getDatabase();
    let processed = 0;
    let failed = 0;

    for (const item of pending) {
      try {
        const payload = JSON.parse(item.payload);
        const endpoint = `/${item.entity_type.toLowerCase()}s`;

        if (item.operation === 'CREATE') {
          await apiClient.post(endpoint, payload);
        } else if (item.operation === 'UPDATE') {
          await apiClient.put(`${endpoint}/${item.entity_id}`, payload);
        } else if (item.operation === 'DELETE') {
          await apiClient.delete(`${endpoint}/${item.entity_id}`);
        }

        await db.runAsync(`UPDATE sync_queue SET status = 'COMPLETED' WHERE id = ?`, [item.id]);
        processed++;
      } catch (err) {
        failed++;
        const newRetryCount = item.retry_count + 1;
        const newStatus = newRetryCount >= 5 ? 'FAILED' : 'PENDING';
        await db.runAsync(
          `UPDATE sync_queue SET retry_count = ?, status = ?, last_error = ? WHERE id = ?`,
          [newRetryCount, newStatus, err?.message || 'Unknown error', item.id]
        );
      }
    }

    return { processed, failed };
  }
};
