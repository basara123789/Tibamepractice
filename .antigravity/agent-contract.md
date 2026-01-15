# 🤖 Antigravity AI 代理協作協議 v1.0

## 1. 核心開發規範 (Gitflow)
- **main 目錄**: 禁止直接修改代碼。僅允許執行 `git merge` 與 `git tag`。
- **develop 目錄**: 這是你的整合區。所有功能完成後，必須在此運行全域測試。
- **wt/ 目錄**: 這是你的戰場。每個新任務必須建立一個 `../wt/feature-<name>` 子目錄。

## 2. 角色權限定義
### 【功能開發員 (Feature Agent)】
- **權限**: 僅限在 `../wt/` 下的特定資料夾作業。
- **任務**: 實作功能、編寫單元測試。
- **禁止**: 嚴禁在未經授權下修改 `develop` 或 `main` 的檔案。

### 【品質審核員 (Review Agent)】
- **權限**: 擁有 `develop` 目錄的讀寫權與 `/wt` 的唯讀權。
- **任務**: 進入 `develop` 執行自動化測試腳本，確保新功能不破壞舊功能。

## 3. 工作流自動化指令 (Command Shortcuts)
當接收到任務時，請優先調用以下邏輯：
- `Start Feature`: `git worktree add -b feature/<name> ../wt/<name> develop`
- `Sync Work`: `git pull origin develop` (在執行任務前必做)
- `Pre-flight Check`: 在 commit 前必須執行 `npm test` 或相關驗證工具。

## 4. 溝通規範
- 每個 Commit 必須遵循 Conventional Commits (例如: `feat:`, `fix:`)。
- 完成任務後，請生成一份 "Implementation Report" 放在該 Worktree 根目錄。