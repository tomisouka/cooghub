cd ~/rabbit/root/projects/onit/coogs-hub && CARGO_BUILD_JOBS=2 pnpm tauri build && sudo dpkg -i src-tauri/target/release/bundle/deb/"Coogs Hub_0.1.0_amd64.deb"
sudo dpkg -i src-tauri/target/release/bundle/deb/"Coogs Hub_0.1.0_amd64.deb"
which coogs-hub && coogs-hub