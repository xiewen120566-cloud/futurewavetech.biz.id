import { Locale } from "@/i18n/routing";
import { Games } from "@/services/data";
import { Box } from "@chakra-ui/react";

import GameItem from "../game-item";

interface Props {
  data: Games;
  locale: Locale;
  channel?: string;
}

const ratioPattern = [1, 4 / 5, 16 / 9, 3 / 4, 6 / 5, 5 / 4];

export default function GameList({ data, locale, channel }: Props) {
  return (
    <Box
      sx={{
        columnCount: { base: 2, md: 3, xl: 4 },
        columnGap: { base: "12px", md: "16px", lg: "24px" },
      }}
    >
      {data?.map((game, index) => (
        <Box
          key={game?.id ?? index}
          mb={{ base: 3, md: 4, lg: 6 }}
          display="inline-block"
          w="full"
          sx={{ breakInside: "avoid" }}
        >
          <GameItem
            data={game}
            locale={locale}
            channel={channel}
            imageRatio={ratioPattern[index % ratioPattern.length]}
            titleLines={2}
          />
        </Box>
      ))}
    </Box>
  );
}
