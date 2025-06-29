import SettingSidebar from "@/components/settings/SettingSidebar"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <SettingSidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}
