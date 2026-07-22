import Link from "next/link";
import { Bell, LogOut, UserCircle } from "lucide-react";

import { logoutAction } from "@/lib/auth/actions";
import { UserCartShell } from "@/components/cart/UserCartShell";
import { Navbar } from "@/components/layout/Navbar";
import { UserSidebar } from "@/components/layout/UserSidebar";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/api/user";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <UserCartShell>
          <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
            <main className="min-h-[70vh]">{children}</main>
          </div>
        </UserCartShell>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              User Dashboard
            </p>
            <p className="text-lg font-semibold text-foreground">
              Halo, {profile.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/profile" className="flex items-center gap-2">
                <UserCircle className="size-4" /> Profil
              </Link>
            </Button>
            <form action={logoutAction}>
              <Button variant="ghost" size="icon">
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <UserCartShell>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:px-6 lg:grid-cols-[240px_1fr]">
          <UserSidebar
            userName={profile.name}
            membership={profile.membership}
          />
          <main className="min-h-[70vh]">{children}</main>
        </div>
      </UserCartShell>
    </div>
  );
}
