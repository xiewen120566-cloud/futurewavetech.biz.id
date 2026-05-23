"use client";
import { useLocale } from "next-intl";
import { GrLanguage } from "react-icons/gr";
import { LOCALE_OPTIONS } from "@/configs";
import { Locale } from "@/i18n/routing";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
const LocaleSwitcher = () => {
  const locale = useLocale();
  const onChange = (locale: Locale) => {
    const { pathname, search } = location;
    const pathnameArr = pathname.split("/");
    pathnameArr[1] = locale;
    location.href = `${pathnameArr.join("/")}${search}`;
  };
  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        color="current"
        aria-label="Options"
        icon={<GrLanguage />}
        variant="ghost"
        size="md"
        fontSize="xl"
      />
      <MenuList defaultValue={locale} minW="fit-content" border="unset">
        {LOCALE_OPTIONS.map(({ value, label }) => (
          <MenuItem
            isDisabled={locale === value}
            key={value}
            value={value}
            onClick={() => {
              onChange(value);
            }}
          >
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
export default LocaleSwitcher;
