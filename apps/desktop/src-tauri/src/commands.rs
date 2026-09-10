use crate::db;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os: String,
    pub arch: String,
    pub version: String,
    pub is_online: bool,
}

#[tauri::command]
pub fn get_system_info() -> SystemInfo {
    SystemInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        is_online: true,
    }
}

#[tauri::command]
pub fn save_offline_record(
    entity_type: String,
    entity_id: String,
    operation: String,
    payload_json: String,
) -> Result<String, String> {
    db::enqueue_offline_change(&entity_type, &entity_id, &operation, &payload_json)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn sync_offline_queue() -> Result<usize, String> {
    // Desktop sync engine bridge
    Ok(0)
}

#[tauri::command]
pub fn print_invoice_pdf(invoice_number: String) -> Result<bool, String> {
    // Native printing integration placeholder
    println!("Desktop native printing triggered for invoice: {}", invoice_number);
    Ok(true)
}

#[tauri::command]
pub fn check_app_update() -> Result<String, String> {
    // Native auto-update check hook
    Ok("You are running the latest NexusCRM Desktop v1.0.0".to_string())
}
