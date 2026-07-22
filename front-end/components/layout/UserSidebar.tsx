import Link from "next/link"
import {
  CalendarDays,
  CreditCard,
  LayoutGrid,
  Scissors,
  UserCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/catalog", label: "Catalog", icon: Scissors },
  { href: "/booking", label: "Booking", icon: CalendarDays },
  { href: "/payment", label: "Pembayaran", icon: CreditCard },
  { href: "/history", label: "Riwayat", icon: CalendarDays },
  { href: "/profile", label: "Profil", icon: UserCircle },
]

interface UserSidebarProps {
  userName: string
  membership: "Standard" | "Gold" | "Platinum"
}

export function UserSidebar({ userName, membership }: UserSidebarProps) {
  return (
    <aside className="hidden h-full flex-col gap-4 border-r border-border/60 bg-sidebar px-4 py-6 lg:flex">
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <p className="text-xs uppercase text-muted-foreground">Member</p>
        <p className="mt-2 text-lg font-semibold text-foreground">{membership} Member</p>
        <p className="mt-1 text-sm text-muted-foreground">{userName}</p>
      </div>
      <nav className="flex flex-col gap-1 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
