 

export const runtime = "edge";

import { Locale } from "@/i18n/routing";

import { getGame } from "@/actions";
import RedirectPlay from "@/components/redriect-play";

interface Props {
  params: {
    locale: Locale;
    id: string;
  };
  searchParams: Record<string, string>;
}
export default async function Page({
  params: { id, locale },
}: Props) {
  const {  gameUrl } = await getGame(locale, id); 

  return <RedirectPlay url={gameUrl} />
}
