import { CornerDecoration } from "@/components/decorations/corner-decoration";
import BackgroundStars from "@/components/decorations/background-stars";
import MemberSidebar from "@/components/MemberSidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch session on server side
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session) {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen bg-[rgb(23,17,17)] text-[#F9ECDC] overflow-hidden flex flex-col">
      <BackgroundStars />

      {/* Golden Borders */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-2 sm:inset-4 border border-[#C99041] rounded-3xl"></div>
        <div className="absolute inset-4 sm:inset-8 border border-[#C99041] rounded-xl"></div>
        <CornerDecoration
          position="top-left"
          className="top-2 left-2 sm:top-4 sm:left-4"
        />
        <CornerDecoration
          position="top-right"
          className="top-2 right-2 sm:top-4 sm:right-4"
        />
        <CornerDecoration
          position="bottom-right"
          className="bottom-2 left-2 sm:bottom-4 sm:left-4 scale-x-[-1]"
        />
        <CornerDecoration
          position="bottom-left"
          className="bottom-2 right-2 sm:bottom-4 sm:left-4 scale-y-[-1]"
        />
      </div>

      <div className="flex-1 container mx-auto px-4 py-12 sm:py-20 relative z-20">
        <div className="lg:flex lg:gap-12 max-w-7xl mx-auto h-full">
          {/* Pass server-fetched session to Client Component Sidebar */}
          <MemberSidebar session={session} />

          {/* Main Content Area - Children can be Server Components */}
          <main className="flex-1 min-w-0">
            <div className="relative animate-in fade-in slide-in-from-right-4 duration-1000">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
