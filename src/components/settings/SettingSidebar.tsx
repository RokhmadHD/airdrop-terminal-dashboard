'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Globe,
  Palette,
  Settings,
  Zap,
} from "lucide-react"

const settingsMenu = [
  {
    label: "API Settings",
    icon: Globe,
    href: "/dashboard/settings/api",
  },
  {
    label: "Appearance",
    icon: Palette,
    href: "/dashboard/settings/appearance",
  },
  {
    label: "SEO Settings",
    icon: Zap,
    href: "/dashboard/settings/seo",
  },
  {
    label: "General",
    icon: Settings,
    href: "/dashboard/settings/general",
  },
]

export default function SettingSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full sm:w-64 border-r bg-background h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold tracking-tight">Website Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your frontend preferences</p>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {settingsMenu.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
              pathname === href
                ? "bg-muted text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
