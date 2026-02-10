"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  MessageSquare,
  Save,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserProfile } from "@/app/actions/user";

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image?: string | null;
    nickname: string | null;
    bio: string | null;
    birthday: string | null;
    birthTime: string | null;
    gender: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Parse initial values from user data
  const initialBirthday = user.birthday
    ? user.birthday.split("-")
    : ["", "", ""];
  const initialBirthTime = user.birthTime
    ? user.birthTime.split(":")
    : ["", ""];

  const [nickname, setNickname] = useState(user.nickname || "");
  const [bio, setBio] = useState(user.bio || "");
  const [birthYear, setBirthYear] = useState<string>(initialBirthday[0] || "");
  const [birthMonth, setBirthMonth] = useState<string>(
    initialBirthday[1] || "",
  );
  const [birthDay, setBirthDay] = useState<string>(initialBirthday[2] || "");
  const [birthHour, setBirthHour] = useState<string>(initialBirthTime[0] || "");
  const [birthMinute, setBirthMinute] = useState<string>(
    initialBirthTime[1] || "",
  );
  const [gender, setGender] = useState<string>(user.gender || "");
  const [isLoading, setIsLoading] = useState(false);

  // Derived variables
  const birthday =
    birthYear && birthMonth && birthDay
      ? `${birthYear}-${birthMonth}-${birthDay}`
      : "";
  const birthTime =
    birthHour && birthMinute ? `${birthHour}:${birthMinute}` : "";

  const getZodiacSign = (month: number, day: number) => {
    const signs = [
      "摩羯座",
      "水瓶座",
      "雙魚座",
      "牡羊座",
      "金牛座",
      "雙子座",
      "巨蟹座",
      "獅子座",
      "處女座",
      "天秤座",
      "天蠍座",
      "射手座",
    ];
    const cutoffs = [20, 19, 20, 20, 21, 21, 22, 22, 22, 23, 22, 21];
    let index = month - 1;
    if (day > cutoffs[index]) {
      index = (index + 1) % 12;
    }
    return signs[index];
  };

  const zodiacSign =
    birthMonth && birthDay
      ? getZodiacSign(parseInt(birthMonth), parseInt(birthDay))
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateUserProfile({
        nickname,
        bio,
        birthday,
        birthTime,
        gender,
      });

      if (!result.success) {
        if (result.error === "Nickname already taken") {
          throw new Error("此暱稱已被其他佔用了，請換一個試試。");
        }
        throw new Error("更新失敗");
      }

      toast({
        title: "更新成功",
        description: "您的個人資料已成功保存到星象館中。",
      });

      // Refresh the page to get updated data
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "更新失敗",
        description:
          error instanceof Error
            ? error.message
            : "無法連結星象館，請稍後再試。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      {/* Header Section */}
      <div className="relative pb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center shadow-inner">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-serif tracking-widest uppercase">
              個人檔案
            </h1>
            <p className="text-primary/40 font-serif text-[10px] uppercase tracking-[0.4em] mt-1">
              Refining Your Celestial Identity
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Edit Form */}
        <div className="lg:col-span-3 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-8 bg-card/30 p-8 rounded-[2rem] border border-border shadow-xl relative overflow-hidden backdrop-blur-sm">
              {/* Subtle background glow */}

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground/80 mb-1 ml-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  顯示暱稱
                </label>
                <div className="relative group">
                  <Input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="h-12 bg-background/50 border border-border focus:border-primary focus:ring-0 text-foreground pl-10 transition-all rounded-2xl placeholder:text-foreground/20 font-serif"
                    placeholder="在此輸入您的靈魂代號"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground/80 mb-1 ml-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  自我介紹
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[120px] bg-background/50 border border-border focus:border-primary focus:ring-0 text-foreground p-6 transition-all rounded-2xl resize-none leading-relaxed placeholder:text-foreground/20 font-serif"
                  placeholder="簡單描述您的內在旅程..."
                />
              </div>

              {/* Soul Signature Section */}
              <div className="pt-6 border-t border-amber-500/10 space-y-6">
                <h3 className="text-sm font-bold text-amber-400 font-serif tracking-[0.2em] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  靈魂印記參數
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Birth Date */}
                  <div className="space-y-3">
                    <Label className="text-xs text-amber-500/70 uppercase tracking-widest ml-1 font-serif">
                      出生日期
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={birthYear} onValueChange={setBirthYear}>
                        <SelectTrigger className="bg-background/40 border-border text-foreground rounded-2xl h-12 px-2 text-sm justify-center font-serif">
                          {birthYear || "年"}
                        </SelectTrigger>
                        <SelectContent className="bg-amber-950 border-amber-500/40 text-amber-100 max-h-[300px]">
                          {Array.from({ length: 107 }).map((_, i) => {
                            const year = (2026 - i).toString();
                            return (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <Select value={birthMonth} onValueChange={setBirthMonth}>
                        <SelectTrigger className="bg-background/50 border border-border text-foreground rounded-2xl h-12 px-2 text-sm justify-center font-serif">
                          {birthMonth || "月"}
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-foreground">
                          {Array.from({ length: 12 }).map((_, i) => {
                            const month = (i + 1).toString().padStart(2, "0");
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <Select value={birthDay} onValueChange={setBirthDay}>
                        <SelectTrigger className="bg-background/50 border border-border text-foreground rounded-2xl h-12 px-2 text-sm justify-center font-serif">
                          {birthDay || "日"}
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-foreground max-h-[300px]">
                          {Array.from({ length: 31 }).map((_, i) => {
                            const day = (i + 1).toString().padStart(2, "0");
                            return (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Birth Time */}
                  <div className="space-y-3">
                    <Label className="text-xs text-amber-500/70 uppercase tracking-widest ml-1 font-serif">
                      出生時間
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={birthHour} onValueChange={setBirthHour}>
                        <SelectTrigger className="bg-background/50 border border-border text-foreground rounded-2xl h-12 font-serif">
                          {birthHour ? `${birthHour} 時` : "時"}
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-foreground max-h-[300px]">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem
                              key={i}
                              value={i.toString().padStart(2, "0")}
                            >
                              {i.toString().padStart(2, "0")} 時
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={birthMinute}
                        onValueChange={setBirthMinute}
                      >
                        <SelectTrigger className="bg-background/50 border border-border text-foreground rounded-2xl h-12 font-serif">
                          {birthMinute ? `${birthMinute} 分` : "分"}
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-foreground max-h-[300px]">
                          {Array.from({ length: 60 }).map((_, i) => (
                            <SelectItem
                              key={i}
                              value={i.toString().padStart(2, "0")}
                            >
                              {i.toString().padStart(2, "0")} 分
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-xs text-amber-500/70 uppercase tracking-widest ml-1 font-serif">
                      能量屬性
                    </Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="h-12 bg-background/50 border border-border focus:border-primary focus:ring-0 text-foreground transition-all rounded-2xl font-serif">
                        <SelectValue placeholder="請選擇您的能量屬性" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-foreground rounded-xl">
                        <SelectItem value="male">陽性能量 / 男性</SelectItem>
                        <SelectItem value="female">陰性能量 / 女性</SelectItem>
                        <SelectItem value="non-binary">
                          多元能量 / 非二元
                        </SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          宇宙能量 / 不提供
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#C99041]/10 space-y-6">
                <div className="flex items-center gap-3 text-xs text-amber-100/30 px-2 group">
                  <ShieldCheck className="w-4 h-4 text-amber-500/40 group-hover:text-amber-500 transition-colors" />
                  您的資料將安全地保存在星象圖書館中，僅用於精確的解讀服務。
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="h-11 px-8 text-amber-100/60 hover:text-amber-100 hover:bg-amber-500/10 rounded-full transition-all"
              >
                <X className="w-4 h-4 mr-2" />
                取消
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 px-10 bg-primary/20 hover:bg-primary/30 text-foreground border border-primary/50 rounded-full shadow-[0_0_20px_rgba(245,173,79,0.15)] hover:shadow-[0_0_25px_rgba(245,173,79,0.25)] transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    寫入中...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    更新檔案
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="lg:sticky lg:top-20">
            <div className="relative group">
              <div className="absolute inset-[-1px] bg-gradient-to-b from-primary/20 to-transparent rounded-[2rem] blur-sm opacity-50"></div>
              <Card className="relative bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-md">
                {/* Floating Preview Tag */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm">
                    <h2 className="text-[9px] font-bold text-primary/40 flex items-center gap-1.5 uppercase tracking-[0.2em] font-serif">
                      <Sparkles className="w-2.5 h-2.5" />
                      實時預覽
                    </h2>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-b from-amber-900/20 to-transparent relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(201,144,65,0.4)_1px,transparent_0)] bg-[size:24px_24px]"></div>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C99041]/20 to-transparent"></div>
                </div>

                <CardContent className="pt-0 pb-12 px-10 relative">
                  <div className="relative -mt-16 mb-8 flex justify-center">
                    <div className="relative">
                      {/* Avatar Glow Ring */}
                      <div className="absolute inset-[-10px] rounded-full bg-amber-500/10 blur-md animate-pulse"></div>

                      {user.image ? (
                        <Image
                          src={user.image}
                          alt="Preview"
                          width={112}
                          height={112}
                          priority
                          unoptimized
                          className="w-28 h-28 rounded-full border-4 border-[#171111] relative z-10 shadow-2xl object-cover"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-600/80 to-amber-400/80 flex items-center justify-center text-gray-900 text-5xl font-bold border-4 border-[#171111] relative z-10 shadow-2xl">
                          {nickname?.[0]?.toUpperCase() ||
                            user.name?.[0]?.toUpperCase() ||
                            "U"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-amber-100 font-serif tracking-tight">
                        {nickname || user.name || "神秘占卜者"}
                      </h3>
                      <p className="text-amber-500/40 text-[10px] flex items-center justify-center gap-2 uppercase tracking-[0.3em] font-medium">
                        <Mail className="w-3 h-3 opacity-40" />
                        {user.email}
                      </p>
                    </div>

                    <div className="py-6 border-y border-[#C99041]/10 space-y-4">
                      <p className="text-amber-50/70 text-[15px] leading-[1.8] font-serif italic line-clamp-3 px-2">
                        「{bio || "此位占卜者尚未寫下他的靈魂語錄..."}」
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-left">
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-amber-500/30 font-bold">
                          靈魂誕辰
                        </h4>
                        <p className="text-amber-100/80 text-sm font-serif">
                          {birthday || "尚未顯化"}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-amber-500/30 font-bold">
                          星時座標
                        </h4>
                        <p className="text-amber-100/80 text-sm font-serif">
                          {birthTime || "尚未顯化"}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-amber-500/30 font-bold">
                          星象歸屬
                        </h4>
                        <p className="text-amber-100/80 text-sm font-serif">
                          {zodiacSign || "尚未顯化"}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-amber-500/30 font-bold">
                          能量本質
                        </h4>
                        <p className="text-amber-100/80 text-sm font-serif uppercase tracking-wider">
                          {gender === "male"
                            ? "陽性能量"
                            : gender === "female"
                              ? "陰性能量"
                              : gender === "non-binary"
                                ? "多元能量"
                                : gender === "prefer-not-to-say"
                                  ? "宇宙能量"
                                  : "觀測中..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
