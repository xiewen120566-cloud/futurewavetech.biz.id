"use client";
import { PropsWithChildren } from "react";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import LocaleSwitcher from "./locale-switcher";
import SideNav from "./side-nav";
import { getTargetHref } from "@/utils";
import { useLocale } from "next-intl";
import { Locale } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { CategoryRecord } from "@/services/data";
export const DesktopNavlink = ({
  href,
  children,
}: PropsWithChildren<{ href: string }>) => {
  return (
    <Button
      as="a"
      size="sm"
      color="gray.300"
      variant="ghost"
      href={href}
      fontWeight="500"
      borderRadius="md"
      px={4}
      py={1}
      height="auto"
      minH="32px"
      bg="transparent"
      _hover={{
        bg: "rgba(255, 165, 0, 0.1)",
        color: "orange.400",
        transform: "none"
      }}
      transition="all 0.2s ease"
    >
      {children}
    </Button>
  );
};

export default function Header({
  hostname,
  categories,
}: {
  hostname: string;
  categories: CategoryRecord[];
}) {
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();

  return (
    <Box
      position="sticky"
      top={0}
      w="full"
      zIndex="sticky"
      bg="gray.800"
      borderBottom="1px solid"
      borderColor="gray.600"
    >
      <Box>
        <Flex
          px={{ base: 3, md: 5, lg: 6 }}
          py={3}
          alignItems="center"
          justifyContent="space-between"
          maxW="1200px"
          mx="auto"
        >
          <Box
            as="a"
            href={getTargetHref(locale, "/", searchParams.get("channel"))}
            display="flex"
            alignItems="center"
            _hover={{
              opacity: 0.8
            }}
            transition="opacity 0.2s ease"
          >
            <Image
              src="/static/Group 116.png"
              alt={hostname}
              h="2.8rem"
              w="auto"
            />
          </Box>
          <Flex
            hideBelow="lg"
            gap={2}
            alignItems="center"
          >
            {categories.map((category) => (
              <DesktopNavlink
                href={getTargetHref(locale, `/category/${category.alias}`)}
                key={category.id}
              >
                {category.name}
              </DesktopNavlink>
            ))}
          </Flex>
          <Flex gap={3} alignItems="center">
            <Box hideBelow="lg">
              <LocaleSwitcher />
            </Box>
            <Box hideFrom="lg">
              <SideNav categories={categories} />
            </Box>
          </Flex>
        </Flex>
        <Flex
          hideFrom="lg"
          justifyContent="center"
          py={2}
          px={3}
          gap={2}
          bg="gray.750"
          borderTop="1px solid"
          borderColor="gray.600"
        >
          <Flex gap={1} flexWrap="wrap" justifyContent="center">
            {categories.slice(0, 4).map((category) => (
              <Button
                as="a"
                href={getTargetHref(locale, `/category/${category.alias}`)}
                key={category.id}
                size="xs"
                color="gray.300"
                variant="ghost"
                bg="transparent"
                borderRadius="sm"
                px={3}
                py={1}
                height="28px"
                minH="28px"
                _hover={{
                  bg: "rgba(255, 165, 0, 0.1)",
                  color: "orange.400"
                }}
                fontSize="13px"
              >
                {category.name}
              </Button>
            ))}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
