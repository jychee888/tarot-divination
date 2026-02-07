require("dotenv").config();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("錯誤: 請在 .env 檔案中設定 GEMINI_API_KEY");
  process.exit(1);
}

const models = [
  { version: "v1beta", model: "gemini-2.0-flash" },
  { version: "v1", model: "gemini-2.0-flash" },
  { version: "v1beta", model: "gemini-flash-latest" },
  { version: "v1beta", model: "gemini-pro-latest" },
];

async function checkAllModels() {
  for (const item of models) {
    const apiUrl = `https://generativelanguage.googleapis.com/${item.version}/models/${item.model}:generateContent?key=${apiKey}`;

    console.log(`\n測試中: ${item.version}/${item.model}...`);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hi" }] }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ ${item.model} 正常工作`);
      } else {
        console.error(
          `❌ ${item.model} 錯誤:`,
          data.error?.message || "未知錯誤",
        );
      }
    } catch (error) {
      console.error(`💥 ${item.model} 異常:`, error.message);
    }
  }
}

checkAllModels();
