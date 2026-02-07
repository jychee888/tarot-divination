import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// POST a new divination record
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { theme, spreadType, cards, question, aiReading, userContext } = await req.json()
    const userId = session.user.id

    if (!theme || !spreadType || !cards) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRecord = await prisma.divinationRecord.create({
      data: {
        theme,
        spreadType,
        cards,
        question,
        aiReading,
        userContext,
        userId,
      } as any,
    })

    // 動態更新用戶個人資料 (如果尚未設置)
    if (userContext && userId) {
      try {
        const user = await (prisma.user as any).findUnique({
          where: { id: userId },
          select: { birthday: true, birthTime: true, gender: true }
        });

        if (user && (!user.birthday || !user.birthTime || !user.gender)) {
          await (prisma.user as any).update({
            where: { id: userId },
            data: {
              birthday: user.birthday || userContext.birthday,
              birthTime: user.birthTime || userContext.birthTime,
              gender: user.gender || userContext.gender,
            }
          });
        }
      } catch (profileError) {
        console.warn("Failed to update user profile:", profileError);
      }
    }

    return NextResponse.json(newRecord, { status: 201 })
  } catch (error) {
    console.error("Request error", error)
    return NextResponse.json({ error: "Error creating divination record" }, { status: 500 })
  }
}

// GET all divination records for the current user
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const userId = session.user.id
        const records = await prisma.divinationRecord.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(records);
    } catch (error) {
        console.error("Request error", error);
        return NextResponse.json({ error: "Error fetching divination records" }, { status: 500 });
    }
}

// DELETE a divination record
// This needs to be in a dynamic route: /api/divinations/[id]/route.ts
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Extract the ID from the URL
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
        }

        // First, verify the record belongs to the user
        const record = await prisma.divinationRecord.findUnique({
            where: { id },
        });

        if (!record) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        if (record.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized to delete this record" }, { status: 403 });
        }

        // Delete the record
        await prisma.divinationRecord.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Record deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: "Error deleting divination record" },
            { status: 500 }
        );
    }
}
