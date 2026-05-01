"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

export function AuthStatus() {
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"google" | "email">("google");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      setError("請輸入有效的電子郵件");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setError("");
      } else {
        setError(data.error || "發送驗證碼失敗");
      }
    } catch (err) {
      setError("發送驗證碼失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !otp) {
      setError("請輸入電子郵件和驗證碼");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        setIsLoginModalOpen(false);
        setOtpSent(false);
        setEmail("");
        setOtp("");
      }
    } catch (err) {
      setError("登入失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse"></div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {session ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              {/* <span className="mr-2 text-white hidden sm:inline">歡迎 ：{session.user?.name}</span> */}
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-400 hover:ring-2  transition-all"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-gray-900 font-bold hover:ring-2 hover:ring-amber-400 transition-all">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-[#171111] backdrop-blur-xl rounded-2xl p-2 border border-[#C99041]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] animate-in fade-in zoom-in-95 duration-200"
              sideOffset={12}
              align="end"
            >
              <DropdownMenu.Item className="outline-none group">
                <Link
                  href="/profile"
                  className="relative w-full text-amber-100/60 hover:text-amber-100 hover:bg-amber-500/10 rounded-xl px-4 py-3 text-sm flex items-center transition-all duration-300 border border-transparent hover:border-[#C99041]/20"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-amber-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                  <span className="tracking-widest font-serif ml-2">
                    個人資料
                  </span>
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="outline-none group">
                <Link
                  href="/history"
                  className="relative w-full text-amber-100/60 hover:text-amber-100 hover:bg-amber-500/10 rounded-xl px-4 py-3 text-sm flex items-center transition-all duration-300 border border-transparent hover:border-[#C99041]/20"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-amber-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                  <span className="tracking-widest font-serif ml-2">
                    占卜歷史
                  </span>
                </Link>
              </DropdownMenu.Item>
              {session.user?.role === "admin" && (
                <DropdownMenu.Item className="outline-none group">
                  <Link
                    href="/admin"
                    className="relative w-full text-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl px-4 py-3 text-sm flex items-center transition-all duration-300 border border-transparent hover:border-amber-400/20"
                  >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-amber-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                    <span className="tracking-widest font-serif ml-2 font-bold">
                      管理者後台
                    </span>
                  </Link>
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Separator className="h-px bg-[#C99041]/10 m-2" />
              <DropdownMenu.Item className="outline-none group">
                <button
                  onClick={() => signOut()}
                  className="relative w-full text-left text-amber-100/20 hover:text-red-400 hover:bg-red-500/5 rounded-xl px-4 py-3 text-sm flex items-center transition-all duration-300 border border-transparent"
                >
                  <span className="tracking-widest font-serif ml-2">
                    安全登出
                  </span>
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="chinese-title-bakudai border border-[#C99041] bg-transparent hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 px-8 py-2 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            登入
          </button>

          <Dialog.Root open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
              <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#171111] border border-[#C99041]/30 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[101] animate-in fade-in zoom-in-95 duration-200">
                <Dialog.Title className="text-2xl font-serif text-amber-300 mb-6 text-center">
                  歡迎來到塔羅聖域
                </Dialog.Title>

                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setLoginMethod("google")}
                    className={`flex-1 py-2 rounded-lg border transition-all ${
                      loginMethod === "google"
                        ? "border-amber-500 bg-amber-500/20 text-amber-300"
                        : "border-gray-600 bg-transparent text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    Google 登入
                  </button>
                  <button
                    onClick={() => setLoginMethod("email")}
                    className={`flex-1 py-2 rounded-lg border transition-all ${
                      loginMethod === "email"
                        ? "border-amber-500 bg-amber-500/20 text-amber-300"
                        : "border-gray-600 bg-transparent text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    Email OTP
                  </button>
                </div>

                {loginMethod === "google" ? (
                  <button
                    onClick={() => signIn("google")}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 rounded-lg hover:bg-gray-100 transition-all font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    使用 Google 帳號登入
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-amber-200/60 text-sm mb-2">
                        電子郵件
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpSent}
                        className="w-full bg-[#1a0f0f] border border-[#C99041]/30 rounded-lg px-4 py-3 text-amber-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50"
                        placeholder="your@email.com"
                      />
                    </div>

                    {!otpSent ? (
                      <button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 py-3 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "發送中..." : "發送驗證碼"}
                      </button>
                    ) : (
                      <>
                        <div>
                          <label className="block text-amber-200/60 text-sm mb-2">
                            驗證碼
                          </label>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="w-full bg-[#1a0f0f] border border-[#C99041]/30 rounded-lg px-4 py-3 text-amber-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all text-center text-2xl tracking-widest"
                            placeholder="000000"
                          />
                        </div>

                        <button
                          onClick={handleEmailLogin}
                          disabled={isLoading}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 py-3 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "登入中..." : "登入"}
                        </button>

                        <button
                          onClick={() => {
                            setOtpSent(false);
                            setOtp("");
                          }}
                          className="w-full text-amber-300/60 hover:text-amber-300 text-sm transition-all"
                        >
                          重新發送驗證碼
                        </button>
                      </>
                    )}

                    {error && (
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    )}
                  </div>
                )}

                <Dialog.Close asChild>
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all">
                    ✕
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </>
      )}
    </div>
  );
}
