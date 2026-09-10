mod commands;
mod db;

pub fn run() {
    if let Err(err) = db::init_local_db() {
        eprintln!("Failed to initialize local SQLite database: {}", err);
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::get_system_info,
            commands::save_offline_record,
            commands::sync_offline_queue,
            commands::print_invoice_pdf,
            commands::check_app_update
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri desktop application");
}
