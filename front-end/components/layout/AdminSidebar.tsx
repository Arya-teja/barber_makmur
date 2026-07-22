"use client"

import * as React from "react"
import Link from "next/link"
import {
  BadgeCheck,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  Scissors,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/catalog", label: "Catalog", icon: Scissors },
  { href: "/admin/accounts", label: "Akun", icon: Users },
  { href: "/admin/bookings", label: "Booking", icon: ListChecks },
  { href: "/admin/payments", label: "Pembayaran", icon: CreditCard },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <aside
      className={cn(
        "relative hidden h-full flex-col gap-4 border-r border-border/60 bg-sidebar px-4 py-6 lg:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-gold bg-black">
            <BadgeCheck className="size-5 text-gold" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">Admin Studio</p>
              <p className="text-xs text-muted-foreground">Premium Console</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={() => setCollapsed((value) => !value)}
        >
          <BookOpen className="size-4" />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground transition hover:bg-muted/40 hover:text-foreground",
              collapsed && "justify-center"
            )}
          >
            <link.icon className="size-4" />
            {!collapsed && link.label}
          </Link>
        ))}
      </nav>

      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <p className="text-xs uppercase text-muted-foreground">Status</p>
        <p className="mt-2 text-sm font-semibold">Operational</p>
        {!collapsed && (
          <p className="mt-1 text-xs text-muted-foreground">Terakhir sync: 2 menit</p>
        )}
      </div>
    </aside>
  )
}
