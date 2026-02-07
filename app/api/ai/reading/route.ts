import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { theme, spread, cards, question, userContext } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        error: "尚未配置 AI API 金鑰。請在 .env 中添加 GEMINI_API_KEY。" 
      }, { status: 500 });
    }

    // 構建求問者個人化資訊
    const userProfilePrompt = userContext ? `
      【求問者資訊】
      占卜時間：${new Date().toLocaleString('zh-TW')}
      出生日期：${userContext.birthday || '未提供'}
      出生時間：${userContext.birthTime || '未提供'}
      性別認同：${userContext.gender || '未提供'}
    ` : `【求問者資訊】占卜時間：${new Date().toLocaleString('zh-TW')}`;

    // 構建 Prompt
    const promptText = `
      現在，你不再是一台機器，也不再是一本書。你是一位在此刻與求問者靈魂共振的「聖域引導者」。你正坐在求問者的對面，透過燭光與牌面，輕聲對他說話。
      
      ${userProfilePrompt}
      
      【對話脈絡】
      占卜主題：${theme}
      牌陣類型：${spread}
      求問者的心聲：${question || "我想聽聽命運的聲音"}

      【呈現在我們之間的卡牌】
      ${cards.map((c: any, i: number) => `牌陣位置 ${i + 1}：${c.name} - ${c.isReversed ? '能量內斂/逆位' : '能量顯化/正位'}`).join('\n')}

      【你的任務：一場私密的靈魂對話】
      請根據牌面，直接對求問者（使用「你」）說出命運的啟示。這應該是一段流暢、感性且溫暖的「談話」，而不是一份有章節的報告。
      
      對話指導原則：
      1. **拒絕書名與章節**：絕對不要使用「第一章」、「章節」、「導言」或類似書籍的標題。這是一次對話，請用自然的語氣開啟、延續與結尾。
      2. **人性的溫度**：語氣要像是一位充滿智慧且溫柔的長輩或知己。你可以使用「我感覺到...」、「我看見了...」、「親愛的靈魂...」這樣的開頭。
      3. **融入牌義**：不要生硬地羅列牌義。你要將卡牌的能量像絲線一樣編織進你的對話中。例如：不要說「寶劍六代表...」，要說「我看見你正划著一葉輕舟，試圖在迷霧中尋找平靜，正如這張寶劍六所揭示的...」。
      4. **結構與排版**：
         - 開頭：先感應他的能量狀態，給予溫暖的問候與共鳴。
         - 核心：串聯所有卡牌，講述一個關於他現狀與未來的完整故事。
         - 叮嚀：在結束前，給予他具體的心靈處方或行動指引，並給予祝福。
         - 使用繁體中文，善用粗體 (**) 強調直擊內心的話語，並使用段落換行讓文字有呼吸感。
      5. **風格**：充滿靈性、感性、神祕感，但絕對要「像人在說話」。總字數約 500 字左右。
    `;

    // 根據 check-gemini.js 的實測結果，嘗試該 API 金鑰友存取的模型
    const attempts = [
      { version: 'v1beta', model: 'gemini-2.0-flash' },
      { version: 'v1', model: 'gemini-2.0-flash' },
      { version: 'v1beta', model: 'gemini-flash-latest' },
      { version: 'v1beta', model: 'gemini-pro-latest' }
    ];

    let lastError = null;

    for (const attempt of attempts) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${apiKey}`;
        
        console.log(`Trying Gemini API: ${attempt.version}/${attempt.model}`);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
          }),
        });

        const data = await response.json();

        if (response.ok) {
          let reading = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reading) {
            // 在回答最前面補上使用者的問題
            const questionHeader = question ? `> **靈魂之問：${question}**\n\n` : "";
            reading = questionHeader + reading;

            console.log(`Success with: ${attempt.version}/${attempt.model}`);
            return NextResponse.json({ reading });
          }
        } else {
          lastError = data.error?.message || "Unknown error";
          console.warn(`Gemini API Attempt (${attempt.version}/${attempt.model}) failed:`, lastError);
          
          // 如果是 API Key 錯誤，直接中斷循環，不需嘗試其他模型
          if (data.error?.status === 'PERMISSION_DENIED' || data.error?.status === 'UNAUTHENTICATED') {
            throw new Error(`API 金鑰無效或權限不足：${lastError}`);
          }
        }
      } catch (e: any) {
        if (e.message.includes('API 金鑰')) throw e;
        lastError = e.message;
      }
    }

    throw new Error(`所有 AI 模型嘗試均失敗。最後一項錯誤：${lastError}`);
  } catch (error: any) {
    console.error("AI Reading Error:", error);
    return NextResponse.json({ 
      error: error.message || "無法生成 AI 解讀，請稍後再試。",
    }, { status: 500 });
  }
}
