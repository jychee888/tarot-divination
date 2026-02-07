import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  // Get session on server side
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session || !session.user?.id) {
    redirect("/");
  }

  // Fetch user data on server side - NO LOADING STATE!
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      nickname: true,
      bio: true,
      birthday: true,
      birthTime: true,
      gender: true,
    } as any,
  });

  if (!user) {
    redirect("/");
  }

  // Pass pre-fetched data to Client Component
  return <ProfileForm user={user as any} />;
}
