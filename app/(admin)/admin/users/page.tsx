import { prisma } from "@/lib/prisma";
import { Users, Search, Filter, Clock } from "lucide-react";
import { UserActions } from "@/components/admin/UserActions";
import { UserFilters } from "@/components/admin/UserFilters";

async function getUsers(q?: string, role?: string, status?: string) {
  const where: any = {};

  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }

  if (role) {
    where.role = role;
  }

  // Handle status filtering with backward compatibility for existing users
  if (status === "active") {
    // If filtering for active, include those explicitly marked active OR those with no status yet
    where.status = { in: ["active", null] };
  } else if (status) {
    where.status = status;
  }

  try {
    const users = await (prisma.user.findMany as any)({
      where,
      orderBy: { id: "desc" },
      include: {
        _count: {
          select: { divinations: true },
        },
      },
    });
    return users;
  } catch (error: any) {
    console.warn(
      "Prisma query failed, trying fallback without new fields:",
      error.message,
    );
    // Fallback: Remove new fields that might be causing "Unknown argument" errors
    const safeWhere = { ...where };
    delete safeWhere.status;

    return await (prisma.user.findMany as any)({
      where: safeWhere,
      orderBy: { id: "desc" },
      include: {
        _count: {
          select: { divinations: true },
        },
      },
    });
  }
}

export default async function AdminUsersPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const { q, role, status } = searchParams;
  const users = await getUsers(q, role, status);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            使用者管理
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            資料庫中註冊用戶的權限配置與活躍概覽
          </p>
        </div>
        <UserFilters />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                用戶身份
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                權限角色
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                數據指標
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                最後活躍
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((user) => {
              const isSuperAdmin = user.email === "jychee888@gmail.com";
              const isAdmin = user.role === "admin" || isSuperAdmin;
              return (
                <tr
                  key={user.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg border border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center shrink-0">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-200 text-sm font-semibold leading-tight">
                            {user.name || "N/A"}
                          </p>
                          {user.status === "blocked" && (
                            <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-500 text-[9px] font-bold rounded border border-rose-500/30 uppercase">
                              Blocked
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                        isSuperAdmin
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                          : isAdmin
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}
                    >
                      {isSuperAdmin
                        ? "super admin"
                        : isAdmin
                          ? "admin"
                          : user.role || "user"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <span className="font-bold text-slate-200">
                        {user._count.divinations}
                      </span>
                      <span className="text-[10px] text-slate-600 uppercase">
                        占卜
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      {user.lastActiveAt ? (
                        new Date(user.lastActiveAt).toLocaleString("zh-TW", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      ) : (
                        <span className="text-slate-700 italic">無紀錄</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <UserActions
                        userId={user.id}
                        userEmail={user.email}
                        userStatus={user.status || "active"}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-slate-800" />
                    <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">
                      找不到符合條件的使用者
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
