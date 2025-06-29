import { clsx, type ClassValue } from "clsx"
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge"
import showdown from 'showdown';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mengekstrak nama domain dari sebuah URL lengkap.
 * @param url - String URL yang akan diproses.
 * @returns Nama domain (e.g., "twitter.com") atau string kosong jika URL tidak valid.
 */
export function getDomainFromUrl(url?: string): string {
  if (!url) return "";
  try {
    // Gunakan constructor URL untuk mem-parsing URL dengan aman
    const parsedUrl = new URL(url);
    // Kembalikan hostname-nya (e.g., "twitter.com", "discord.gg")
    return parsedUrl.hostname;
  } catch (error) {
    // Jika URL tidak valid, kembalikan string kosong
    console.error("Invalid URL for domain extraction:", url);
    return "";
  }
}

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) {
    return ""; // Kembalikan kosong jika tidak ada tanggal
  }

  try {
    const date = new Date(dateString);
    
    // Cek apakah tanggalnya valid setelah di-parse
    if (isNaN(date.getTime())) {
      // Jika tidak valid (misal, format salah), jangan buat crash
      console.warn("Invalid time value passed to formatRelativeTime:", dateString);
      return "";
    }

    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return ""; // Kembalikan kosong jika ada error lain
  }
}

// --- TAMBAHKAN FUNGSI BARU DI BAWAH INI ---

const markdownConverter = new showdown.Converter();

/**
 * Mengkonversi string Markdown menjadi string HTML.
 * @param markdown - String dalam format Markdown.
 * @returns String dalam format HTML.
 */
export function convertMarkdownToHtml(markdown: string): string {
  // showdown akan mengubah **text** menjadi <strong>text</strong>, dll.
  return markdownConverter.makeHtml(markdown);
}


export async function simulateTypingAdvanced(
  text: string,
  callback: (currentText: string) => void,
  mode: 'char' | 'sentence' | 'paragraph' = 'char',
  speed: number = 10,
  onDone?: () => void, // ✅ callback ketika selesai
  onProgress?: (percentage: number) => void
) {
  let chunks: string[] = [];

  switch (mode) {
    case 'sentence':
      chunks = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
      break;
    case 'paragraph':
      chunks = text.split(/\n\s*\n/);
      break;
    case 'char':
    default:
      chunks = text.split("");
      break;
  }

  let current = "";

   for (let i = 0; i < chunks.length; i++) {
    current += chunks[i];
    callback(current);

    // Hitung progress
    const percentage = Math.round(((i + 1) / chunks.length) * 100);
    if (onProgress) onProgress(percentage);

    await new Promise((r) => setTimeout(r, speed));
  }

  if (onDone) onDone();
}
