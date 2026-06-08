 

export const runtime = "edge";

import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaCirclePlay } from "react-icons/fa6";
import { getCategories, getGames } from "@/actions";
import Footer from "@/components/footer";
import GameItem from "@/components/game-item";
import Header from "@/components/header";
import Info from "@/components/info";
import StarRating from "@/components/star-rating";
import { Locale } from "@/i18n/routing";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { getTargetHref, randomGames} from "@/utils";
const ElTemplate = dynamic(() => import("@/components/el-temlplate"), { ssr: false })
interface Props {
  params: {
    locale: Locale;
    slug: string;
  };
  searchParams: Record<string, string>;
}
const getLikes = () => {
  const min = 3;
  const max = 5;
  const number = Math.random() * (max - min) + min;
  return parseFloat(number.toFixed(1)); // 保留一位小数
};
export default async function Page({
  params: { locale, slug },
  searchParams,
}: Props) {
  const baseUrlInput = (process.env.BASE_URL ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "");
  const baseUrl = baseUrlInput || "https://adventurewanders.com";
  const normalizedBaseUrl =
    baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : `https://${baseUrl}`;
  const { hostname } = new URL(normalizedBaseUrl);
  const categories = await getCategories(locale);
  const allGames = await getGames(locale);
  const t = await getTranslations({ locale, namespace: "Common" });
  const game = allGames.find((item) => item.id.toString() === slug);
  if (!game) {
    return notFound();
  }

  const category = categories.find((item) => item.id === game.categoryId);

  const categoryByGames = allGames.filter(
    (item) => item.categoryId === category?.id && item.slug !== slug
  );
  const typeGames = randomGames(categoryByGames.length, 18).map((item) => categoryByGames[item]);

  if (!category) {
    return null;
  }
  return (
    <>
      <Header hostname={hostname} categories={categories} />
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} pt={{ base: 4, md: 6 }}>
        <ElTemplate
          divId="div-gpt-ad-future-detail-top"
          adUnitPath="/23353820184/0522Ad-01"
          sizes={[[300, 50], [300, 100], [300, 250], [300, 75], [320, 50]]}
          minWidth={300}
          minHeight={50}
        />
      </Container>
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} py={{ base: 4, md: 6 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6, lg: 10 }}>
          <Box>
            <AspectRatio
              ratio={{ base: 16 / 9, md: 1 }}
              rounded={{ base: "xl", md: "2xl" }}
              overflow="hidden"
              bg="surface.1"
              border="1px solid"
              borderColor="border.subtle"
            >
              <Image
                alt={game.name}
                width={600}
                height={600}
                src={game.image}
                priority={false}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AspectRatio>
          </Box>
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="border.subtle"
            rounded={{ base: "xl", md: "2xl" }}
            p={{ base: 4, md: 6 }}
          >
            <Heading as="h2" size={{ base: "md", md: "lg" }} lineHeight={1.25} color="text.primary">
              {game.name}
            </Heading>
            <Box pt={3}>
              <StarRating size="12px" rating={getLikes()} color="#ffaa25" />
            </Box>
            <Flex gap={2} pt={3} alignItems="center">
              <Box fontSize="2xs" color="text.muted">
                BY
              </Box>
              <Tag fontSize="2xs" size="sm" rounded="full" colorScheme="cyan">
                {category?.name}
              </Tag>
            </Flex>
            <Box pt={{ base: 4, md: 5 }}>
              <Button
                colorScheme="cyan"
                size="lg"
                w="full"
                rounded="full"
                as="a"
                rel="noopener noreferrer"
                href={getTargetHref(locale, `/play/${slug}`, searchParams?.channel)}
                rightIcon={<FaCirclePlay />}
              >
                {t("Play")}
              </Button>
            </Box>
            <Heading as="h3" size="md" pt={{ base: 6, md: 7 }} pb={3} color="text.primary">
              {t("Introduction")}
            </Heading>
            <Text color="text.muted">{game.description}</Text>
          </Box>
        </SimpleGrid>
      </Container>
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} pb={{ base: 4, md: 6 }}>
        <Box
          bg="surface.1"
          border="1px solid"
          borderColor="border.subtle"
          rounded={{ base: "xl", md: "2xl" }}
          p={{ base: 4, md: 5 }}
        >
          <SimpleGrid gap={3} columns={{ base: 3, sm: 4, md: 6, lg: 8, xl: 12 }}>
            {typeGames.map((item) => {
              return (
                <GameItem
                  key={item?.id}
                  data={item}
                  locale={locale}
                  channel={searchParams?.channel}
                />
              );
            })}
          </SimpleGrid>
        </Box>
        <Info locale={locale} />
        {/* <ElTemplate
          divId="div-gpt-ad-future-detail-bottom"
          adUnitPath="/23353820184/0522Ad-01"
          sizes={[[300, 50], [300, 100], [300, 250], [300, 75], [320, 50]]}
          minWidth={300}
          minHeight={50}
        /> */}
      </Container>
      <Footer />
    </>
  );
}
