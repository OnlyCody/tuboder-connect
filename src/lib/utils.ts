import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformGoogleDriveUrl(url: string): string {
  if (!url) return url;
  
  // Google Drive link kontrolü
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // FILE_ID'yi çıkar ve kullanılabilir formata çevir
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  
  // Google Drive linki değilse orijinal URL'yi döndür
  return url;
}
