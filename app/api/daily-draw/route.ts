import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; // Assuming prisma instance export
import tarotCards from "@/data/tarot-cards";

// Helper to get random card
function getRandomCard() {
  const randomIndex = Math.floor(Math.random() * tarotCards.length);
  const card = tarotCards[randomIndex];
  const isReversed = Math.random() > 0.5;
  return { ...card, isReversed };
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get start of today (UTC 00:00:00) => Taiwan 08:00:00
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

    // Check existing record
    const existingRecord = await prisma.divinationRecord.findFirst({
      where: {
        userId: userId,
        spreadType: "daily-draw",
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (existingRecord) {
      return NextResponse.json({ 
        hasDrawn: true, 
        reading: (existingRecord as any).aiReading,
        card: (existingRecord.cards as any[])[0] // Typo in schema: cards is Json
      });
    }

    return NextResponse.json({ hasDrawn: false });

  } catch (error: any) {
    console.error("Daily Draw Check Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Double check if already drawn (race condition prevention)
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

    const existingRecord = await prisma.divinationRecord.findFirst({
      where: {
        userId: userId,
        spreadType: "daily-draw",
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (existingRecord) {
      return NextResponse.json({ 
        hasDrawn: true, 
        reading: (existingRecord as any).aiReading,
        card: (existingRecord.cards as any[])[0]
      });
    }

    // Draw a card
    const drawnCard = getRandomCard();

    // Generate AI Reading
    const apiKey = process.env.GEMINI_API_KEY;
    let aiReading = "今日運勢生成失敗，請稍後再試。";

    if (apiKey) {
      const promptText = `
        你是一位神祕的塔羅占卜師。使用者抽出了一張「每日靈感牌」。
        
        【卡牌資訊】
        牌名：${drawnCard.name}
        正逆位：${drawnCard.isReversed ? '逆位 (Reversed)' : '正位 (Upright)'}
        
        請用繁體中文，給予他一段約 100-150 字的短評。
        內容包含：
        1. 這張牌在今天的核心指引。
        2. 一句充滿力量的祝福或行動建議。
        
        語氣溫暖、神祕且具有啟發性。不要解釋太多牌義細節，直接給予生活上的指引。
      `;

      const attempts = [
        { version: "v1beta", model: "gemini-2.0-flash" },
        { version: "v1beta", model: "gemini-2.0-flash-lite" },
        { version: "v1beta", model: "gemini-flash-latest" },
      ];

      for (const attempt of attempts) {
        try {
          const apiUrl = `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${apiKey}`;
          console.log(`Attempting Gemini API with model: ${attempt.model}`);

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
            }),
          });
          
          if (!response.ok) {
             const errorData = await response.json().catch(() => ({}));
             console.warn(`Gemini API Attempt (${attempt.model}) failed with status ${response.status}:`, JSON.stringify(errorData));
             continue;
          }

          const data = await response.json();

          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            aiReading = data.candidates[0].content.parts[0].text;
            console.log(`Gemini API Success with model: ${attempt.model}`);
            break; // Success
          } else {
             console.warn(`Gemini API Attempt (${attempt.model}) returned no content:`, JSON.stringify(data));
          }
        } catch (e: any) {
          console.error(`Gemini API Attempt (${attempt.model}) error:`, e);
        }
      }
    }

    // Save to DB
    const newRecord = await prisma.divinationRecord.create({
      data: {
        userId,
        theme: "每日靈感",
        spreadType: "daily-draw",
        cards: [drawnCard], // array of 1 card
        aiReading,
        userContext: {}, // No specific context for daily draw usually, or maybe fetch user profile?
      } as any,
    });

    return NextResponse.json({
      hasDrawn: true,
      reading: aiReading,
      card: drawnCard
    });

  } catch (error: any) {
    console.error("Daily Draw Create Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
