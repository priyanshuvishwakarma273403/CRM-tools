import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';

let dbInstance = null;

export const getDatabase = async () => {
  if (dbInstance) return dbInstance;
  
  try {
    dbInstance = await SQLite.openDatabaseAsync('crm_local.db');
    await dbInstance.execAsync(CREATE_TABLES_SQL);
    return dbInstance;
  } catch (error) {
    console.warn('Failed to initialize local SQLite database:', error);
    throw error;
  }
};
