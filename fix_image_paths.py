import json
import os

def populate_meanings_structure(data_file):
    """
    讀取 tarot-data.json 檔案，並為所有 'meanings' 為空的卡牌，
    填充一個標準的、內容為空的巢狀結構。
    """
    # 定義標準的、空的牌義結構
    default_structure = {
        "love": {
            "upright": {"summary": "", "details": []},
            "reversed": {"summary": "", "details": []}
        },
        "career": {
            "upright": {"summary": "", "details": []},
            "reversed": {"summary": "", "details": []}
        },
        "relationship": {
            "upright": {"summary": "", "details": []},
            "reversed": {"summary": "", "details": []}
        },
        "health": {
            "upright": {"summary": "", "details": []},
            "reversed": {"summary": "", "details": []}
        },
        "self-exploration": {
            "upright": {"summary": "", "details": []},
            "reversed": {"summary": "", "details": []}
        }
    }

    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            tarot_data = json.load(f)
        print(f"✅ 成功讀取資料檔案: {os.path.basename(data_file)}")
    except (IOError, json.JSONDecodeError) as e:
        print(f"❌ 讀取或解析 {os.path.basename(data_file)} 時發生錯誤: {e}")
        return

    populated_count = 0
    for card in tarot_data:
        # 檢查 'meanings' 欄位是否為空物件 {}
        if not card.get('meanings'):
            card['meanings'] = default_structure
            populated_count += 1
            print(f"  -> 已為卡牌 '{card.get('name')}' 填充空的牌義結構。")

    if populated_count == 0:
        print("\n所有卡牌都已擁有完整的牌義結構，無需填充。")
        return

    try:
        with open(data_file, 'w', encoding='utf-8') as f:
            json.dump(tarot_data, f, indent=2, ensure_ascii=False)
        print(f"\n--- ✅ 結構填充報告 ---")
        print(f"成功為 {populated_count} 張卡牌填充了標準的牌義結構。")
        print(f"檔案 {os.path.basename(data_file)} 已成功更新！")
    except IOError as e:
        print(f"❌ 寫入 {os.path.basename(data_file)} 時發生錯誤: {e}")

if __name__ == "__main__":
    CWD = os.getcwd()
    TAROT_DATA_FILE = os.path.join(CWD, 'data', 'tarot-data.json')

    print("--- 塔羅牌牌義結構填充腳本 ---")
    populate_meanings_structure(TAROT_DATA_FILE)
    print("\n--- 腳本執行完畢 ---")