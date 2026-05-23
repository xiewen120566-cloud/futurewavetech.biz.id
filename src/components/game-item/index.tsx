import { Locale } from "@/i18n/routing";
import { GameRecord } from "@/services/data";
import { getTargetHref } from "@/utils";
import { AspectRatio, Box, Heading, LinkBox, LinkOverlay } from "@chakra-ui/react";
import Image from "next/image";

interface Props {
  data: GameRecord;
  locale: Locale;
  channel?: string;
  imageRatio?: number;
  titleLines?: number;
}

const GameItem = ({
  data,
  locale,
  channel,
  imageRatio = 16 / 9,
  titleLines = 1,
}: Props) => {
  if(!data){
    return null;
  }
  return (
    <LinkBox
      bg="surface.1"
      border="1px solid"
      borderColor="border.subtle"
      rounded={{ base: "lg", md: "xl" }}
      overflow="hidden"
      transition="transform 160ms ease, box-shadow 160ms ease"
      _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
    >
      <AspectRatio ratio={imageRatio}>
        <Image
          alt={data?.name}
          width={480}
          height={270}
          src={data?.image}
          priority={false}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AspectRatio>
      <Box px={2.5} py={2}>
        <LinkOverlay href={getTargetHref(locale, `/detail/${data.id}`, channel)}>
          <Heading
            as="h5"
            size="xs"
            fontSize="sm"
            lineHeight={1.4}
            color="text.primary"
            noOfLines={titleLines}
          >
            {data.name}
          </Heading>
        </LinkOverlay>
      </Box>
    </LinkBox>
  );
};

export default GameItem
