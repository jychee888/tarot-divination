
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Correct type for dynamic routes in Next.js 15+
) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params; // Await params

    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 })
    }

    // First, verify the record belongs to the user
    const record = await prisma.divinationRecord.findUnique({
      where: { id },
    })

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    if (record.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this record" },
        { status: 403 }
      )
    }

    // Delete the record
    await prisma.divinationRecord.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Record deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Error deleting divination record" },
      { status: 500 }
    )
  }
}
