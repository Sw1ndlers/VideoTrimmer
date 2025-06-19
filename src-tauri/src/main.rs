// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs::{self, rename},
    path::{Path, PathBuf},
    process::Command,
};

use tauri::{Manager, WindowEvent};
use trash;
use window_shadows::set_shadow;

fn append_to_file_name(path: &Path, append: &str) -> PathBuf {
    let file_name = PathBuf::from(path.file_name().unwrap());
    let file_stem = file_name.file_stem().unwrap();
    let file_extension = file_name.extension().unwrap();

    path.with_file_name(format!(
        "{}-{}.{}",
        file_stem.to_str().unwrap(),
        append,
        file_extension.to_str().unwrap()
    ))
}

fn seconds_to_timestamp(seconds: f32) -> String {
    let hours = (seconds / 3600.0).floor();
    let minutes = ((seconds % 3600.0) / 60.0).floor();
    let seconds = seconds % 60.0;

    format!("{:02}:{:02}:{:.4}", hours, minutes, seconds)
}

// No idea if this is even needed
#[tauri::command]
fn extend_scope(handle: tauri::AppHandle, path: PathBuf) {
    let asset_scope = handle.asset_protocol_scope();
    let file_scope = handle.fs_scope();

    asset_scope.allow_file(&path).unwrap();
    file_scope.allow_file(&path).unwrap();
}

#[tauri::command]
fn process_video(
    mut input_path: PathBuf,
    output_path: PathBuf,
    start_time: f32,
    end_time: f32,
) -> Result<(), String> {
    println!(
        "
    Processing video:
        Input path: {}
        Output path: {}
        Start time: {}
        End time: {}
    ",
        input_path.display(),
        output_path.display(),
        start_time,
        end_time
    );

    let original_input_path = input_path.clone();
    let mut using_temp = false;

    // if input_path = output_path, rename input_path to input_path-old
    if input_path == output_path {
        let temp_path = append_to_file_name(&input_path, "temp");
        fs::copy(&input_path, &temp_path)
            .map_err(|err| format!("Failed to copy input file to temporary file: {}", err))?;

        input_path = temp_path;
        using_temp = true;
    }

    let mut output = Command::new("ffmpeg")
        .arg("-hide_banner")
        .arg("-i")
        .arg(&input_path)
        .arg("-ss")
        .arg(seconds_to_timestamp(start_time))
        .arg("-to")
        .arg(seconds_to_timestamp(end_time))
        .arg("-async")
        .arg("1")
        .arg(&output_path)
        .spawn()
        .map_err(|err| {
            format!(
                "Failed to spawn ffmpeg process: {}. Make sure ffmpeg is installed and in your PATH.",
                err
            )
        })?;

    // wait for the process to finish
    output.wait().unwrap();

    if using_temp {
        trash::delete(&original_input_path).unwrap();
        rename(&input_path, &original_input_path).unwrap();
    }

    Ok(())
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
        .invoke_handler(tauri::generate_handler![process_video])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
