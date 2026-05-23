import { getPathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

export const useLocaleAndChannel = () => {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const channel = searchParams.get("channel");
  return (pathname: string, otherSearchStr?: string) => {
    let searchStr: string = "";
    if (channel) {
      searchStr = `?channel=${channel}`;
    }
    if (otherSearchStr) {
      if (searchStr) {
        searchStr = `${searchStr}&${otherSearchStr}`;
      } else {
        searchStr = `?${otherSearchStr}`;
      }
    }
    return getPathname({
      locale,
      href: {
        pathname: `${pathname}${searchStr}`,
      }
    });
  };
};