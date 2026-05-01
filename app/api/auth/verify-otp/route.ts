import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "請提供電子郵件和驗證碼" },
        { status: 400 }
      );
    }

    // Find valid OTP
    const otpRecord = await (prisma as any).emailOtp.findFirst({
      where: {
        email,
        otp,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "驗證碼無效或已過期" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await (prisma as any).emailOtp.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0], // Use email prefix as name
          emailVerified: new Date(),
        },
      });
    }

    console.log(`[OTP] Verified OTP for ${email}, user ID: ${user.id}`);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("[OTP] Error verifying OTP:", error);
    return NextResponse.json(
      { error: "驗證失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
