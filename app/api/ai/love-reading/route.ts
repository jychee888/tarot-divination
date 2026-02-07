import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { relationshipStatus, question, cards } = await request.json();

    if (!relationshipStatus || !question || !cards || cards.length !== 6) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "尚未配置 AI API 金鑰。請在 .env 中添加 GEMINI_API_KEY。" },
        { status: 500 },
      );
    }

    const statusLabels: Record<string, string> = {
      crush: "曖昧對象",
      ex: "前任",
      current: "現任",
    };

    const prompt = `你是一位專業的塔羅占卜師，專精於愛情關係的深度解讀。請根據以下資訊提供一份詳盡、深入且富有洞察力的塔羅解讀：

**關係狀態**: ${statusLabels[relationshipStatus] || relationshipStatus}
**求問者的問題**: ${question}

**抽到的6張塔羅牌**：
${cards
  .map(
    (card: any) =>
      `${card.position}. **${card.positionMeaning}**: ${card.name}`,
  )
  .join("\n")}

請按照以下結構提供完整的解讀（總字數約 800-1000 字）：

---

**【從您的角度看這段關係】**（250-300字）
詳細分析前三張牌（位置1、3、5），逐一解讀：
- 位置1（你對Ta的想法）：深入分析求問者內心對對方的真實感受，這張牌顯示了什麼能量和態度
- 位置3（你對目前關係的看法）：闡述求問者如何看待現況，有什麼期待或擔憂
- 位置5（你對未來的期待）：揭示求問者內心深處對未來的渴望或恐懼

在分析中：
- 提及牌面的正/逆位及其能量意義
- 將三張牌連結起來，看出求問者的整體心境
- 適當提及元素（火、水、土、風）的影響

**【從對方的角度看這段關係】**（250-300字）
詳細分析後三張牌（位置2、4、6），逐一解讀：
- 位置2（Ta對你的想法）：解讀對方對求問者的看法和感受
- 位置4（Ta對目前關係的看法）：分析對方如何定位這段關係
- 位置6（Ta對未來的期待）：揭示對方對未來的想像和考量

在分析中：
- 同樣提及牌面的正/逆位
- 連結三張牌，描繪對方的整體心態
- 分析對方的感性與理性層面

**【整體能量分析與關係動態】**（150-200字）
綜合所有6張牌，分析：
- 雙方在情感基礎上的契合度
- 關係中的主要挑戰或障礙
- 能量的平衡（火、水、土、風元素的分布）
- 雙方期待或行動上的差異
- 關係當前的核心議題

**【塔羅給您的建議】**（150-200字）
提供3-4個具體、實際可行的建議：
- 如何調整自己的心態或行為
- 如何更好地理解對方
- 如何改善關係或處理當前困境
- 給予鼓勵和正面的指引

**【結語】**（30-50字）
溫暖的提醒，強調選擇權和行動權在求問者手中。

---

**寫作要求**：
1. 使用「您」稱呼求問者，語氣專業、溫暖且富有同理心
2. 每個牌義都要深入解讀，不只是簡單描述表面意義
3. 將多張牌的訊息串連起來，形成完整的故事和洞察
4. 使用繁體中文，適當使用**粗體**強調關鍵牌名和重點
5. 段落要有層次感，每段聚焦一個主題
6. 避免使用 emoji，保持專業嚴肅的占卜氛圍
7. 分析要細緻入微，展現塔羅師的專業洞察力`;

    // Try multiple Gemini API models with fallback
    const attempts = [
      { version: "v1beta", model: "gemini-2.0-flash" },
      { version: "v1", model: "gemini-2.0-flash" },
      { version: "v1beta", model: "gemini-flash-latest" },
      { version: "v1beta", model: "gemini-pro-latest" },
    ];

    let lastError = null;

    for (const attempt of attempts) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${apiKey}`;

        console.log(
          `Trying Love Reading API: ${attempt.version}/${attempt.model}`,
        );

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const reading = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reading) {
            console.log(
              `Love Reading Success with: ${attempt.version}/${attempt.model}`,
            );
            return NextResponse.json({ reading });
          }
        } else {
          lastError = data.error?.message || "Unknown error";
          console.warn(
            `Love Reading Attempt (${attempt.version}/${attempt.model}) failed:`,
            lastError,
          );

          // If API key error, stop trying other models
          if (
            data.error?.status === "PERMISSION_DENIED" ||
            data.error?.status === "UNAUTHENTICATED"
          ) {
            throw new Error(`API 金鑰無效或權限不足：${lastError}`);
          }
        }
      } catch (e: any) {
        if (e.message.includes("API 金鑰")) throw e;
        lastError = e.message;
      }
    }

    throw new Error(`所有 AI 模型嘗試均失敗。最後一項錯誤：${lastError}`);
  } catch (error: any) {
    console.error("Love Reading AI Error:", error);
    return NextResponse.json(
      {
        error: error.message || "AI 解讀服務暫時無法使用，請稍後再試",
      },
      { status: 500 },
    );
  }
}
