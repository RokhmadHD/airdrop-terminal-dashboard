// src/app/page.tsx

import { redirect } from "next/navigation";

export default function RootPage() {
  // Secara otomatis, arahkan siapa saja yang mengakses halaman ini
  // ke halaman login admin.
  redirect("/dashboard");

  // Karena redirect terjadi di server, tidak ada yang akan di-render.
  // Kita bisa return null atau biarkan kosong.
  return null;
}