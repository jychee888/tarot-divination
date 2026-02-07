import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { nickname, bio, birthday, birthTime, gender } = await req.json()
    const userId = session.user.id

    // Check if nickname is already taken by another user
    if (nickname) {
      const existingUser = await prisma.user.findFirst({
        where: {
          nickname: nickname,
          NOT: { id: userId },
        },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Nickname already taken" }, { status: 400 })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nickname: nickname,
        bio: bio,
        birthday: birthday,
        birthTime: birthTime,
        gender: gender,
      } as any,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Request error", error)
    return NextResponse.json({ error: "Error updating user" }, { status: 500 })
  }
}
