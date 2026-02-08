import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { theme, spread, cards, question, userContext } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
      return NextResponse.json({ 
        error: "尚未配置 AI API 金鑰。請在 .env 中添加 GEMINI_API_KEY。" 
      }, { status: 500 });
    }

    // 獲取後台設定的 AI 引導語
    let sysPromptPrefix = "";
    try {
      const systemSettingModel = 
        (prisma as any).systemSetting || 
        (prisma as any).systemSettings || 
        (prisma as any).SystemSetting || 
        (prisma as any).SystemSettings;

      if (systemSettingModel) {
        const setting = await systemSettingModel.findUnique({
          where: { key: "ai_prompt_prefix" }
        });
        if (setting?.value) {
          sysPromptPrefix = setting.value + "\n\n";
        }
      }
    } catch (e) {
      console.warn("Could not fetch system settings:", e);
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
      ${sysPromptPrefix}現在，你不再是一台機器，也不再是一本書。你是一位在此刻與求問者靈魂共振的「聖域引導者」。你正坐在求問者的對面，透過燭光與牌面，輕聲對他說話。
      
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
      1. **本年度核心命題**：開篇請先直接點出求問者在 ${new Date().getFullYear()} 年度的靈魂核心命題。
      2. **季度能量導引**：必須針對這一年的四個季度（春、夏、秋、冬）分別給予簡短但精確的能量預測與應對建議。
      3. **開運祕方**：在對話結尾處，根據牌面能量提供以下兩個具體建議：
         - **${new Date().getFullYear()} 年度幸運小物**：一樣具備象徵意義的物品，能與今年的能量共振。
         - **${new Date().getFullYear()} 年度幸運色**：一個具體的色彩，能幫助他平穩氣場。
      4. **拒絕書名與章節**：絕對不要使用「第一章」、「章節」、「導言」或類似書籍的標題。這是一次對話，請用自然的語氣開啟、延續與結尾。
      5. **融入牌義**：將內容編織進你的對話中。例如：不要說「寶劍六代表...」，要說「我看見你正划著一葉輕舟，這正如這張寶劍六所揭示的...」。
      6. **排版格式**：
         - 使用繁體中文，善用粗體 (**) 強調關鍵字。
         - 使用段落換行讓文字有呼吸感。
         - 總字數約 600-800 字左右，內容要紮實且充滿靈性厚度。
    `;

    // 隱碼顯示 API Key 末四碼以供確認
    console.log(`[AI] Using API Key suffix: ...${apiKey.slice(-4)}`);

    // 根據實測結果，優先嘗試穩定版模型
    const attempts = [
      { version: 'v1beta', model: 'gemini-1.5-flash' },
      { version: 'v1beta', model: 'gemini-1.5-pro' },
      { version: 'v1beta', model: 'gemini-2.0-flash' }, // 若可用
      { version: 'v1beta', model: 'gemini-pro' }
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
            const finalReading = questionHeader + reading;
            
            console.log(`Success with: ${attempt.version}/${attempt.model}`);
            return NextResponse.json({ reading: finalReading });
          }
        } else {
          lastError = data.error?.message || "Unknown error";
          console.warn(`Gemini API Attempt (${attempt.version}/${attempt.model}) failed:`, lastError);
          
          if (data.error?.code === 403 || data.error?.status === 'PERMISSION_DENIED') {
             // specific api key error
             throw new Error(`API Key invalid or permission denied: ${lastError}`);
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
