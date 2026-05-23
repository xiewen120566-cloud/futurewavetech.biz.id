import { notFound } from "next/navigation";
import { Locale } from "./i18n/routing";
import { CategoryRecord, GameRecord, Games } from "./services/data";

export const getGames = async (locale: Locale): Promise<Games> => {
  return (await import(`../data/${locale}/data.json`)).default;
};

export const getCategories = async (locale: Locale): Promise<CategoryRecord[]> => {
  return (await import(`../data/${locale}/categories.json`)).default;
};

export const getCategory = async (locale: Locale, slug: string) => {
    const categories = await getCategories(locale);
    const allGames = await getGames(locale);
    const category = categories.find(item => item.alias === slug);
    const games = allGames.filter(game => game.categoryId === category?.id);
    return {
      ...category,
      games
    }
}

export const getGame = async (
  locale: Locale,
  slug: string
): Promise<GameRecord> => {
  const allGames: Games = (await import(`../data/${locale}/data.json`)).default;

  const game = allGames.find((item) => item.id.toString() === slug);

  if (game) {
    return game
  }
  return notFound()
};
