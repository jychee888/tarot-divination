#!/bin/bash
# -------------------------------------------------------------
# macOS 自動定時備份排程設定工具 (Setup Automated Backup for Mac)
# -------------------------------------------------------------

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLIST_LABEL="com.tarot.databackup"
PLIST_FILE="$HOME/Library/LaunchAgents/${PLIST_LABEL}.plist"
RUNNER_SCRIPT="$PROJECT_DIR/scripts/run-backup-cron.sh"

chmod +x "$RUNNER_SCRIPT"

echo "======================================================="
echo "🔮 塔羅牌系統 - macOS 本地自動定時備份設定精靈"
echo "======================================================="

# 建立 ~/Library/LaunchAgents 目錄（若不存在）
mkdir -p "$HOME/Library/LaunchAgents"

# 如果舊排程已存在，先卸載
if launchctl list | grep -q "$PLIST_LABEL"; then
    echo "⏳ 正在更新現有排程..."
    launchctl unload "$PLIST_FILE" 2>/dev/null
fi

# 產生 macOS 專屬的 LaunchAgent 配置
# 優點：即使 Mac 筆電在排程時間睡眠，待喚醒後也會自動補執行！
cat <<EOF > "$PLIST_FILE"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_LABEL}</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${RUNNER_SCRIPT}</string>
    </array>

    <key>WorkingDirectory</key>
    <string>${PROJECT_DIR}</string>

    <!-- 每天中午 12:00 自動執行一次 -->
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>12</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>${PROJECT_DIR}/backups/launchd.log</string>

    <key>StandardErrorPath</key>
    <string>${PROJECT_DIR}/backups/launchd-error.log</string>
</dict>
</plist>
EOF

# 載入排程至 macOS 系統
launchctl load "$PLIST_FILE"

echo ""
echo "🎉 定期同步備份設定完成！"
echo "-------------------------------------------------------"
echo "📅 排程頻率：每天中午 12:00 自動執行一次"
echo "💻 備份位置：${PROJECT_DIR}/backups/"
echo "📝 執行日誌：${PROJECT_DIR}/backups/auto-backup.log"
echo "💡 特點：macOS 原生 LaunchAgent 支援睡眠喚醒自動補備份，並會自動保留最近 14 份備份"
echo "-------------------------------------------------------"
echo "如需停用定時備份，可執行："
echo "launchctl unload $PLIST_FILE && rm $PLIST_FILE"
echo "======================================================="
