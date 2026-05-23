import { motion, useCycle } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { LOCALE_OPTIONS } from "@/configs";
import { Locale } from "@/i18n/routing";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CategoryRecord } from "@/services/data";
import { getTargetHref } from "@/utils";
import { useSearchParams } from "next/navigation";
const SideNav = ({ categories }:  {categories: CategoryRecord[]}) => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const locale = useLocale() as Locale;
  const t = useTranslations("Common");
  const searchParams = useSearchParams()
  const onChange = (locale: Locale) => {
    const { pathname, search } = location;
    const pathnameArr = pathname.split("/");
    pathnameArr[1] = locale;
    location.href = `${pathnameArr.join("/")}${search}`;
  };
  return (
    <>
      <Button
        as={motion.button}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        size="md"
        variant="ghost"
        p={0}
        onClick={() => {
          toggleOpen();
        }}
      >
        <Box w={6} h={6} pos="relative">
          <Box
            as={motion.span}
            variants={{
              open: {
                top: "0.6875rem",
                transform: "rotate(45deg)",
              },
            }}
            pos="absolute"
            w="1.125rem"
            h="0.125rem"
            top="0.4375rem"
            left="0.1875rem"
            rounded="full"
            bg="currentcolor"
            transition="all .12s"
          ></Box>
          <Box
            as={motion.span}
            variants={{
              open: {
                bottom: "0.6875rem",
                transform: "rotate(-45deg)",
              },
            }}
            pos="absolute"
            w="1.125rem"
            h="0.125rem"
            bottom="0.4375rem"
            left="0.1875rem"
            rounded="full"
            bg="currentcolor"
            transition="all .12s"
          ></Box>
        </Box>
      </Button>
      <Drawer
        placement="left"
        isOpen={isOpen}
        onClose={() => {
          toggleOpen();
        }}
      >
        <DrawerOverlay bg="blackAlpha.600" />
        <DrawerContent bg="drawer.dialog.bg">
          <DrawerHeader px={4}>
            <DrawerCloseButton size="lg" top={3} right={3} />
          </DrawerHeader>
          <DrawerBody p={4}>
          <Text fontSize="md" opacity={0.75}>
              {t("Category")}
            </Text>
            <VStack gap={2} align="stretch" my={4}>
              {categories.map(({ id, name, alias }) => (
                <Button
                  key={id}
                  justifyContent="start"
                  variant="ghost"
                  as="a"
                  href={getTargetHref(locale, `/category/${alias}`, searchParams.get("channel"))}
                  size="md"
                >
                  {name}
                </Button>
              ))}
            </VStack>
            <Text fontSize="md" opacity={0.75}>
              {t("Locales")}
            </Text>
            <VStack gap={2} align="stretch" my={4}>
              {LOCALE_OPTIONS.map(({ value, label }) => (
                <Button
                  key={value}
                  isDisabled={value === locale}
                  justifyContent="start"
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    onChange(value);
                  }}
                >
                  {label}
                </Button>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default SideNav;
