
import { LogOut, Search } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Admin Console
            </p>
            <p className="text-lg font-semibold text-foreground">
              Barber Noir Studio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground md:flex">
              <Search className="size-3" />
              Cari booking atau user
            </div>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="size-4" /> Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:px-6 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <main className="min-h-[70vh]">{children}</main>
      </div>
    </div>
  );
}
