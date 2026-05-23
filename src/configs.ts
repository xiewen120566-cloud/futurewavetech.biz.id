import { Locale } from "./i18n/routing";

export interface LocaleRecord {
  value: Locale;
  label: string;
}

export const LOCALE_OPTIONS: Array<LocaleRecord> = [
  {
    value: "en-US",
    label: "English",
  },
  {
    value: "ja-JP",
    label: "日本語",
  }
];

export const CATEGORY_BG_MAP: Record<string, string> = {
  girls: "#F5F5DC",
  animal: "#ffb6c1",
  skill: "#fff",
  casual: "#f0f0f0",
  racing: "#d2b48c",
}
export const CATEGORY_HEADING_COLOR_MAP: Record<string, string>  = {
  girls: "#003366",
  animal: "#8A2BE2",
  skill: "#FF4500",
  casual: "#00BFFF",
  racing: "#228B22",
}
export const CATEGORY_COLOR_MAP: Record<string, string>  = {
  girls: "#333333",
  animal: "#333333",
  skill: "#FFFFFF",
  casual: "#333333",
  racing: "#4B3D2D",
}

export const CATEGORY_SECONDAY_COLOR_MAP: Record<string, string>  = {
  girls: "#FFA500",
  animal: "#32CD32",
  skill: "#000000",
  casual: "#FFA500",
  racing: "#FFD700",
}