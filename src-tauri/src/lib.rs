use std::fs;
use std::path::PathBuf;
use tauri::Manager;

fn project_root(_app: &tauri::AppHandle) -> Result<PathBuf, String> {
  // Read project path from ~/.coogshub_path (written by vite plugin on dev start)
  if let Some(home) = std::env::var("HOME").ok().or_else(|| std::env::var("USERPROFILE").ok()) {
    let config = PathBuf::from(&home).join(".coogshub_path");
    if config.exists() {
      if let Ok(p) = fs::read_to_string(&config) {
        let path = PathBuf::from(p.trim());
        if path.join("src/data").exists() {
          return Ok(path);
        }
      }
    }
  }
  Err("Project path not found. Run pnpm dev once to register the project location.".to_string())
}

fn entries_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
  Ok(project_root(app)?.join("src/content/talk2me/entries"))
}

#[tauri::command]
fn save_data_file(app: tauri::AppHandle, filename: String, content: String) -> Result<(), String> {
  let safe = std::path::Path::new(&filename).file_name()
    .ok_or("invalid filename")?.to_string_lossy().to_string();
  let target = project_root(&app)?.join("src/data").join(&safe);
  fs::write(&target, &content).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_data_file(app: tauri::AppHandle, filename: String) -> Result<String, String> {
  let safe = std::path::Path::new(&filename).file_name()
    .ok_or("invalid filename")?.to_string_lossy().to_string();
  let target = project_root(&app)?.join("src/data").join(&safe);
  fs::read_to_string(&target).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_memory(app: tauri::AppHandle) -> Result<String, String> {
  let target = project_root(&app)?.join("src/data/memory.js");
  fs::read_to_string(&target).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_deadlines(app: tauri::AppHandle, content: String) -> Result<(), String> {
  let home = std::env::var("HOME").unwrap_or_default();
  let log  = PathBuf::from(&home).join(".coogshub_debug.log");
  let root = project_root(&app);
  let _ = fs::write(&log, format!("root={:?}\ncontent_len={}\n", root, content.len()));
  let target = root?.join("src/data/memory.js");
  fs::write(&target, &content).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_entries(app: tauri::AppHandle) -> Result<Vec<serde_json::Value>, String> {
  let dir = entries_dir(&app)?;
  let mut entries = vec![];
  for entry in fs::read_dir(&dir).map_err(|e| e.to_string())? {
    let entry = entry.map_err(|e| e.to_string())?;
    let meta  = entry.metadata().map_err(|e| e.to_string())?;
    if !meta.is_file() { continue; }
    let filename = entry.file_name().to_string_lossy().to_string();
    let size     = meta.len();
    let mtime    = meta.modified().ok()
      .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
      .map(|d| d.as_millis() as u64);
    let birthtime = meta.created().ok()
      .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
      .map(|d| d.as_millis() as u64);
    entries.push(serde_json::json!({ "filename": filename, "size": size, "mtime": mtime, "birthtime": birthtime }));
  }
  entries.sort_by(|a, b| b["mtime"].as_u64().cmp(&a["mtime"].as_u64()));
  Ok(entries)
}

#[tauri::command]
fn read_entry(app: tauri::AppHandle, filename: String) -> Result<String, String> {
  let path = entries_dir(&app)?.join(sanitize(&filename));
  fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_entry(app: tauri::AppHandle, filename: String, content: String, course_id: Option<String>) -> Result<(), String> {
  let dir = match course_id {
    Some(id) if !id.is_empty() => project_root(&app)?.join("src/content/subjects").join(id),
    _ => entries_dir(&app)?,
  };
  fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
  fs::write(dir.join(sanitize(&filename)), &content).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_entry(app: tauri::AppHandle, filename: String) -> Result<(), String> {
  let path = entries_dir(&app)?.join(sanitize(&filename));
  fs::remove_file(&path).map_err(|e| e.to_string())
}

fn sanitize(name: &str) -> String {
  std::path::Path::new(name)
    .file_name()
    .unwrap_or_default()
    .to_string_lossy()
    .to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::default().build())
    .invoke_handler(tauri::generate_handler![
      save_data_file,
      load_data_file,
      load_memory,
      save_deadlines,
      list_entries,
      read_entry,
      save_entry,
      delete_entry,
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}