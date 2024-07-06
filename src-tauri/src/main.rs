// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, WindowEvent};
use window_shadows::set_shadow;

#[tauri::command]
fn extend_scope(handle: tauri::AppHandle, path: std::path::PathBuf) {
    let asset_scope = handle.asset_protocol_scope();
    let file_scope = handle.fs_scope();

    // ideally you don't apply a path sent from the frontend or at least not without some validation
    asset_scope.allow_file(&path).unwrap();
    file_scope.allow_file(&path).unwrap();
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let Some(window) = app.get_window("main") else {
                return Ok(());
            };

            set_shadow(&window, true).expect("Unsupported platform!");
            
            window.on_window_event(|event| match event {
                WindowEvent::Resized(..) => std::thread::sleep(std::time::Duration::from_millis(5)),
                _ => {}
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![extend_scope])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
