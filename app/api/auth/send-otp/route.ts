import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "請提供有效的電子郵件地址" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Delete any existing unused OTPs for this email
    await (prisma as any).emailOtp.deleteMany({
      where: {
        email,
        used: false,
      },
    });

    // Save OTP to database
    await (prisma as any).emailOtp.create({
      data: {
        email,
        otp,
        expiresAt,
        used: false,
      },
    });

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailTemplate = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(135deg, #1a0f0f 0%, #2d1810 100%); color: #f5e6d3;">
        <div style="text-align: center; border-bottom: 2px solid #c9a227; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #c9a227; font-size: 28px; margin: 0; letter-spacing: 2px;">🔮 塔羅聖域</h1>
          <p style="color: #d4af37; margin: 10px 0 0 0; font-size: 14px;">TAROT SANCTUARY</p>
        </div>
        
        <div style="background: rgba(201, 162, 39, 0.05); border: 1px solid rgba(201, 162, 39, 0.2); border-radius: 12px; padding: 30px; text-align: center;">
          <p style="font-size: 16px; margin-bottom: 20px; color: #e8d5b5;">您的登入驗證碼</p>
          
          <div style="background: rgba(201, 162, 39, 0.1); border: 2px solid #c9a227; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #c9a227; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</span>
          </div>
          
          <p style="font-size: 14px; color: #a89080; margin-top: 20px;">
            此驗證碼將於 <strong style="color: #c9a227;">10 分鐘</strong> 後失效<br>
            請勿將此驗證碼分享給他人
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(201, 162, 39, 0.2);">
          <p style="font-size: 12px; color: #8a7a6a;">
            若您未要求此驗證碼，請忽略此郵件<br>
            這是一封自動發送的郵件，請勿回覆
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"塔羅聖域" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "【塔羅聖域】您的登入驗證碼",
      html: emailTemplate,
    });

    console.log(`[OTP] Sent OTP to ${email}`);

    return NextResponse.json({
      success: true,
      message: "驗證碼已發送至您的信箱",
    });
  } catch (error: any) {
    console.error("[OTP] Error sending OTP:", error);
    return NextResponse.json(
      { error: "發送驗證碼失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
