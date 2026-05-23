import { Locale } from '@/i18n/routing';
import { Flex, Text } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { FiFrown } from 'react-icons/fi';

export default async function Empty ({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Common" })
    return (
      <Flex
      p={3}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={1}
    >
      <FiFrown size="32" />
      <Text>{t("Empty")}</Text>
    </Flex>
    );
};
