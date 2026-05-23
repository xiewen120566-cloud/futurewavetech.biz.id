 

export const runtime = "edge";

import { getCategories, getGames } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  Flex,
  VStack,
  Heading,
  Box,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getTargetHref, randomGames } from "@/utils";
import Info from "@/components/info";
import { getTranslations } from "next-intl/server";
import GameList from "@/components/game-list";
import { FaChevronRight } from "react-icons/fa6";
const ElTemplate = dynamic(() => import("@/components/el-temlplate"), { ssr: false })
interface Props {
  params: {
    locale: Locale;
  };
  searchParams: Record<string, string>;
}

export default async function Page({
  params: { locale },
  searchParams,
}: Props) {
  const baseUrlInput = (process.env.BASE_URL ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "");
  const baseUrl = baseUrlInput || "https://futurewavetech.biz.id";
  const normalizedBaseUrl =
    baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : `https://${baseUrl}`;
  const { hostname } = new URL(normalizedBaseUrl);
  const allGames = await getGames(locale);
  const categories = await getCategories(locale);
  const t = await getTranslations({ locale, namespace: "Common" });

  const newGames = randomGames(allGames.length, 8).map((item) => allGames[item]);
  const topGames = randomGames(allGames.length, 8).map((item) => allGames[item]);
  return (
    <Box bg="green.50" minH="100vh">
      <Header hostname={hostname} categories={categories} />
      <Container
        maxWidth="container.xl"
        px={{ base: 3, md: 4, lg: 6 }}
        py={{ base: 4, md: 6 }}
      >
        <ElTemplate
          divId="div-gpt-ad-1779455753877-0"
          adUnitPath="/23353820184/0522Ad-01"
          sizes={[[300, 50], [300, 100], [300, 250], [300, 75], [320, 50]]}
          minWidth={300}
          minHeight={50}
        />
        <VStack alignItems="stretch" gap={{ base: 6, md: 8 }}>
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="border.subtle"
            rounded={{ base: "xl", md: "2xl" }}
            overflow="hidden"
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              px={{ base: 4, md: 5 }}
              py={{ base: 3, md: 4 }}
              borderBottom="1px solid"
              borderColor="border.subtle"
            >
              <Heading
                fontSize={{ base: "md", md: "lg" }}
                textTransform="uppercase"
                color="text.primary"
              >
                {t("Games", { category: t("New") })}
              </Heading>
            </Flex>
            <Box px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
              <GameList
                data={newGames}
                locale={locale}
                channel={searchParams?.channel}
              />
            </Box>
          </Box>
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="border.subtle"
            rounded={{ base: "xl", md: "2xl" }}
            overflow="hidden"
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              px={{ base: 4, md: 5 }}
              py={{ base: 3, md: 4 }}
              borderBottom="1px solid"
              borderColor="border.subtle"
            >
              <Heading
                fontSize={{ base: "md", md: "lg" }}
                textTransform="uppercase"
                color="text.primary"
              >
                {t("Games", { category: t("Top") })}
              </Heading>
            </Flex>
            <Box px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
              <GameList
                data={topGames}
                locale={locale}
                channel={searchParams?.channel}
              />
            </Box>
          </Box>
          {categories.map((category) => {
            const games = allGames.filter((game) => game.categoryId === category.id);
            const gamesList = randomGames(games.length, 8).map((item) => games[item]);
            if (!gamesList.length) {
              return null;
            }

            return (
              <Box
                key={category.alias}
                bg="surface.1"
                border="1px solid"
                borderColor="border.subtle"
                rounded={{ base: "xl", md: "2xl" }}
                overflow="hidden"
              >
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  px={{ base: 4, md: 5 }}
                  py={{ base: 3, md: 4 }}
                  borderBottom="1px solid"
                  borderColor="border.subtle"
                >
                  <Flex
                    justifyContent="space-between"
                    w="full"
                    alignItems="center"
                    gap={4}
                  >
                    <Heading
                      fontSize={{ base: "md", md: "lg" }}
                      color="text.primary"
                      textTransform="uppercase"
                    >
                      {t("Games", { category: category.name })}
                    </Heading>
                    <Flex
                      alignItems="center"
                      as="a"
                      href={getTargetHref(
                        locale,
                        `/category/${category.alias}`,
                        searchParams?.channel
                      )}
                      alignSelf="flex-end"
                      color="text.muted"
                      fontWeight="bold"
                      fontSize="xs"
                      opacity={0.75}
                    >
                      {t("More")}
                      <FaChevronRight size="10px" />
                    </Flex>
                  </Flex>
                </Flex>
                <Box px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
                  <GameList
                    data={gamesList.slice(0, 8)}
                    locale={locale}
                    channel={searchParams?.channel}
                  />
                </Box>
              </Box>
            );
          })}
          <Info locale={locale} />
        </VStack>
        {/* <ElTemplate
          divId="div-gpt-ad-1779455753877-0"
          adUnitPath="/23353820184/0522Ad-01"
          sizes={[[300, 50], [300, 100], [300, 250], [300, 75], [320, 50]]}
          minWidth={300}
          minHeight={50}
        /> */}
      </Container>
      <Footer />
    </Box>
  );
}
