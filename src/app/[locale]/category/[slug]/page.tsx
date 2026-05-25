 

export const runtime = "edge";

import { getCategories, getGames } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  SimpleGrid,
  VStack,
  Heading,
  Flex,
  Box,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";

interface Props {
  params: {
    locale: Locale;
    slug: string;
  };
  searchParams: Record<string, string>;
}

import Header from "@/components/header";
import Footer from "@/components/footer";
import Info from "@/components/info";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import GameItem from "@/components/game-item";
import { randomGames } from "@/utils";
const ElTemplate = dynamic(() => import("@/components/el-temlplate"), { ssr: false })


export default async function Page({
  params: { locale, slug },
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
  const categories = await getCategories(locale);
  const allGames = await getGames(locale);
  const t = await getTranslations({ locale, namespace: "Common" });
  const category = categories.find((item) => item.alias === slug);

  if (!category) {
    return notFound();
  }

  const _list = allGames.filter(
    (item) => item.categoryId === category.id 
  );
  const categoryByGames = randomGames(_list.length, 8).map((item) => _list[item]);

  return (
    <>
      <Header categories={categories} hostname={hostname} />
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} py={{ base: 4, md: 6 }}>
        <ElTemplate
          divId="div-gpt-ad-future-category-top"
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
            <Box px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
              <Flex alignItems="center" gap={3}>
                {/* <Image
                  alt={t("Games", { category: category.name })}
                  src={`/static/images/category/${category.alias}.png`}
                  width="48"
                  height="48"
                  priority={false}
                /> */}
                <Heading
                  fontSize={{ base: "md", md: "xl" }}
                  color="text.primary"
                  textTransform="uppercase"
                >
                  {t("Games", { category: category.name })}
                </Heading>
              </Flex>
              <SimpleGrid
                pt={{ base: 3, md: 4, lg: 6 }}
                columns={{ base: 2, sm: 3, md: 4, lg: 6 }}
                gap={{ base: 3, md: 4, lg: 6 }}
              >
                {categoryByGames.map((item, index) => (
                  <GameItem
                    key={`${item?.id ?? "game"}-${index}`}
                    data={item}
                    locale={locale}
                    channel={searchParams?.channel}
                  />
                ))}
              </SimpleGrid>
            </Box>
          </Box>
          <Info locale={locale} />
        </VStack>
        {/* <ElTemplate
          divId="div-gpt-ad-future-category-bottom"
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
