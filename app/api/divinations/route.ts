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
    const { theme, spreadType, cards } = await req.json()
    const userId = session.user.id

    if (!theme || !spreadType || !cards) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRecord = await prisma.divinationRecord.create({
      data: {
        theme,
        spreadType,
        cards,
        userId,
      },
    })

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
