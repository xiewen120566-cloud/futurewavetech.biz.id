import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

const locales = [
  "en-US",
  "de-DE",
  "ja-JP",
  "ko-KR",
  "pt-BR",
  "es-ES",
  "fr-FR",
] as const;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "en-US",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type Locale = (typeof locales)[number];
