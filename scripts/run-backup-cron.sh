#!/bin/bash
# -------------------------------------------------------------
# 專案定時備份執行腳本 (Mac Cron / Launchd Runner)
# -------------------------------------------------------------

# 切換到專案根目錄
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR" || exit 1

# 確保 backups 目錄存在
mkdir -p "$PROJECT_DIR/backups"
LOG_FILE="$PROJECT_DIR/backups/auto-backup.log"

echo "==========================================" >> "$LOG_FILE"
echo "⏰ 開始執行自動同步備份: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"

# 尋找 node 執行檔（支援 nvm、brew 或系統預設）
NODE_BIN=""
if [ -f "/Users/cjy/.nvm/versions/node/v22.23.4/bin/node" ]; then
    NODE_BIN="/Users/cjy/.nvm/versions/node/v22.23.4/bin/node"
elif command -v node >/dev/null 2>&1; then
    NODE_BIN="$(command -v node)"
elif [ -f "/usr/local/bin/node" ]; then
    NODE_BIN="/usr/local/bin/node"
elif [ -f "/opt/homebrew/bin/node" ]; then
    NODE_BIN="/opt/homebrew/bin/node"
fi

if [ -z "$NODE_BIN" ]; then
    echo "❌ 找不到 node 執行路徑！" >> "$LOG_FILE"
    exit 1
fi

echo "使用 Node: $NODE_BIN" >> "$LOG_FILE"

# 執行備份並寫入日誌
"$NODE_BIN" scripts/backup-db.js >> "$LOG_FILE" 2>&1

EXIT_CODE=$?
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ 自動備份成功完成: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
else
    echo "❌ 自動備份失敗 (Exit Code: $EXIT_CODE): $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
fi
echo "==========================================" >> "$LOG_FILE"
