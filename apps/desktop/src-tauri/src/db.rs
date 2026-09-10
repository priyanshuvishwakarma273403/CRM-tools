use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct OfflineRecord {
    pub id: String,
    pub entity_type: String,
    pub entity_id: String,
    pub operation: String,
    pub payload_json: String,
    pub status: String,
}

pub fn init_local_db() -> Result<Connection> {
    let conn = Connection::open("nexus_crm_offline.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS offline_queue (
            id TEXT PRIMARY KEY,
            entity_type TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            operation TEXT NOT NULL,
            payload_json TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'PENDING',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;
    Ok(conn)
}

pub fn enqueue_offline_change(
    entity_type: &str,
    entity_id: &str,
    operation: &str,
    payload_json: &str,
) -> Result<String> {
    let conn = init_local_db()?;
    let id = format!("sync_{}", std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis());
    conn.execute(
        "INSERT INTO offline_queue (id, entity_type, entity_id, operation, payload_json, status)
         VALUES (?1, ?2, ?3, ?4, ?5, 'PENDING')",
        params![id, entity_type, entity_id, operation, payload_json],
    )?;
    Ok(id)
}
