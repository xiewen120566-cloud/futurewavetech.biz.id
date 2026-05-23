export interface GameRecord {
  name: string;
  image: string;
  gameUrl: string;
  description: string;
  categoryId: number;
  slug: string;
  instructions: string;
  id: number;
  likes: number;
}

export interface CategoryRecord {
  id: number;
  name: string;
  alias: string;
}

export type Games = GameRecord[];

