import { prisma } from "@/lib/prisma";
import {
  Users,
  Mail,
  Calendar,
  ShieldCheck,
  Search,
  MoreVertical,
} from "lucide-react";

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      _count: {
        select: { divinations: true },
      },
    },
  });
  return users as any[];
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-amber-100 tracking-wider">
            使用者管理
          </h1>
          <p className="text-amber-200/40 mt-1 font-serif">
            檢視與管理所有註冊使用者的權限與活動資料
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="搜尋 Email 或 姓名..."
            className="bg-[#171111] border border-amber-900/30 rounded-full px-6 py-2 text-sm text-amber-100 focus:outline-none focus:border-amber-500/50 w-64 pl-12"
          />
          <Search className="w-4 h-4 text-amber-500/50 absolute left-5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-[#171111] border border-amber-900/30 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/40 border-b border-amber-900/30">
              <th className="px-6 py-4 text-sm font-serif text-amber-500 uppercase tracking-widest">
                使用者
              </th>
              <th className="px-6 py-4 text-sm font-serif text-amber-500 uppercase tracking-widest">
                身分角色
              </th>
              <th className="px-6 py-4 text-sm font-serif text-amber-500 uppercase tracking-widest">
                註冊資料
              </th>
              <th className="px-6 py-4 text-sm font-serif text-amber-500 uppercase tracking-widest text-center">
                占卜次數
              </th>
              <th className="px-6 py-4 text-sm font-serif text-amber-500 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/10">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-amber-500/5 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-amber-900/50 overflow-hidden bg-black/40 flex items-center justify-center">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-5 h-5 text-amber-900" />
                      )}
                    </div>
                    <div>
                      <p className="text-amber-100 font-bold">
                        {user.name || "未設定名稱"}
                      </p>
                      <p className="text-amber-200/40 text-xs flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit ${
                      user.role === "admin"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {user.role === "admin" && (
                      <ShieldCheck className="w-3 h-3" />
                    )}
                    {user.role || "user"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="space-y-1 text-amber-200/60 font-serif">
                    <p className="flex items-center gap-2">
                      <span className="text-amber-500/40">生日:</span>{" "}
                      {user.birthday || "未提供"}
                    </p>
                    <p className="flex items-center gap-2 text-[10px]">
                      <span className="text-amber-500/40 italic">
                        ID: {user.id.substring(user.id.length - 8)}
                      </span>
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-amber-100 group-hover:text-amber-400 transition-colors">
                    {user._count.divinations}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-amber-500/10 rounded-lg text-amber-200/40 hover:text-amber-200 transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
