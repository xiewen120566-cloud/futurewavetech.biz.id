import { Locale } from "@/i18n/routing";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export default async function Info({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Info" });
  const baseUrlInput = (process.env.BASE_URL ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "");
  const baseUrl = baseUrlInput || "https://adventurewanders.com";
  const normalizedBaseUrl =
    baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : `https://${baseUrl}`;

  const generateText = () => {
    const { hostname } = new URL(normalizedBaseUrl);
    return `${hostname.at(0)?.toUpperCase()}${hostname.slice(1)}`;
  };

  return (
    <Box py={{ base: 3, md: 5, lg: 7 }}>
      <Card
        bg="transparent"
        size={{ base: "sm", md: "md", lg: "lg" }}
        shadow="none"
      >
        <CardBody pt={0}>
          <VStack fontSize="xs" gap={1} alignItems="stretch" color="blue.600">
            <Heading size="sm" pb={1} color="blue.700">
              {t.rich("section1.title", {
                hostname: normalizedBaseUrl,
                tagname: (text) => (
                  <Link
                    fontSize="xs"
                    href={text as string}
                    color="blue.500"
                    mr={1}
                  >
                    {generateText()}
                  </Link>
                ),
              })}
            </Heading>
            <Text>{t("section1.paragraph1")}</Text>
            <Text>{t("section1.paragraph2")}</Text>
            <Text>{t("section1.paragraph3")}</Text>
            <Text>{t("section1.paragraph4")}</Text>
            <Text>{t("section1.paragraph5")}</Text>
          </VStack>
        </CardBody>
      </Card>
      <Card
        bg="transparent"
        size={{ base: "sm", md: "md", lg: "lg" }}
        shadow="none"
      >
        <CardBody pt={0}>
          <VStack fontSize="xs" gap={1} alignItems="stretch" color="blue.600">
            <Heading size="sm" pb={1} color="blue.700">
              {t.rich("section2.title", {
                hostname: normalizedBaseUrl,
                tagname: (text) => (
                  <Link
                    fontSize="xs"
                    href={text as string}
                    color="blue.500"
                    mr={1}
                  >
                    {generateText()}
                  </Link>
                ),
              })}
            </Heading>
            <Text>
              {t.rich("section2.paragraph1", {
                hostname: normalizedBaseUrl,
                tagname: (text) => (
                  <Link
                    fontSize="xs"
                    href={text as string}
                    color="blue.500"
                    mr={1}
                  >
                    {generateText()}
                  </Link>
                ),
              })}
            </Text>
            <Text>{t("section2.paragraph2")}</Text>
            <Text>{t("section2.paragraph3")}</Text>
            <Text>{t("section2.paragraph4")}</Text>
            <Text>{t("section2.paragraph5")}</Text>
            <Text>{t("section2.paragraph6")}</Text>
            <Text>{t("section2.paragraph7")}</Text>
            <Text>{t("section2.paragraph8")}</Text>
            <Text>{t("section2.paragraph9")}</Text>
            <Text>{t("section2.paragraph10")}</Text>
            <Text>{t("section2.paragraph11")}</Text>
            <Text>{t("section2.paragraph12")}</Text>
          </VStack>
        </CardBody>
      </Card>
      <Card
        bg="transparent"
        size={{ base: "sm", md: "md", lg: "lg" }}
        shadow="none"
      >
        <CardBody pt={0}>
          <VStack fontSize="xs" gap={1} alignItems="stretch" color="blue.600">
            <Heading size="sm" pb={1} color="blue.700">
              {t.rich("section3.title", {
                hostname: normalizedBaseUrl,
                tagname: (text) => (
                  <Link
                    fontSize="xs"
                    href={text as string}
                    color="blue.500"
                    mr={1}
                  >
                    {generateText()}
                  </Link>
                ),
              })}
            </Heading>
            <Text>
              {t.rich("section3.paragraph1", {
                hostname: normalizedBaseUrl,
                tagname: (text) => (
                  <Link
                    fontSize="xs"
                    href={text as string}
                    color="blue.500"
                    mr={1}
                  >
                    {generateText()}
                  </Link>
                ),
              })}
            </Text>
            <Text>
              {t.rich("section3.paragraph2", {
                hostname: normalizedBaseUrl,
                tagname: (text) => (
                  <Link
                    fontSize="xs"
                    href={text as string}
                    color="blue.500"
                    mr={1}
                  >
                    {generateText()}
                  </Link>
                ),
              })}
            </Text>
            <Text>{t("section3.paragraph3")}</Text>
            <Text>{t("section3.paragraph4")}</Text>
            <Text>
              {t.rich("section3.paragraph5", {
                hostname: normalizedBaseUrl,
                tagname: (text) => (
                  <Link
                    fontSize="xs"
                    href={text as string}
                    color="blue.500"
                    mr={1}
                  >
                    {generateText()}
                  </Link>
                ),
              })}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
