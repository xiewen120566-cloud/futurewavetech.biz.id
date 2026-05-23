import { Locale, getPathname } from "@/i18n/routing";
import { Games } from "@/services/data";

export const getTargetHref = (locale: Locale, pathname: string, channel?: string | null, otherSearchStr?: string) => {
  let searchStr: string = "";

  if (otherSearchStr) {
    searchStr = `?${otherSearchStr}`
  }

  if (channel) {
    if (searchStr) {
      searchStr = `${searchStr}&channel=${channel}`;
    } else {
      searchStr = `?channel=${channel}`;
    }
  }

  return getPathname({
    locale,
    href: {
      pathname: `${pathname}${searchStr}`,
    }
  });
}

export const randomGames = (len: number, total: number) => {
  const array = Array.from({length: len}, (_, i) => i + 1);
  return array.sort(() => 0.5 - Math.random()).slice(0, total);
}

export const splitGames = (games: Games) => {
  const destGames = [];
  while(games.length) {
    const sliceGames = games.splice(0, 6);
    destGames.push(sliceGames)
  }
  return destGames
}
