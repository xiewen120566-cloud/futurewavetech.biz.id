import type { PropsWithChildren } from "react";

export const runtime = "edge";

export default function RootLayout({ children }: PropsWithChildren) {
  return children;
}
