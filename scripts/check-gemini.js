require("dotenv").config();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("錯誤: 請在 .env 檔案中設定 GEMINI_API_KEY");
  process.exit(1);
}

async function checkGemini() {
  const model = "gemini-2.0-flash";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  console.log(`正在測試模型: ${model}...`);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "你好，這是一個測試訊息。" }] }],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ 測試成功!");
      console.log("回應內容:", data.candidates[0].content.parts[0].text);
    } else {
      console.error("❌ 測試失敗:");
      console.error(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("💥 發生錯誤:", error.message);
  }
}

checkGemini();
