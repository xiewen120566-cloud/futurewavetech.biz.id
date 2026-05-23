 

export const runtime = "edge";

import BaseLayout from "@/components/basic-layout";
import { routing } from "@/i18n/routing";

export default function GlobalNotFound() {
  return (
    <BaseLayout locale={routing.defaultLocale}>
    </BaseLayout>
  );
}
