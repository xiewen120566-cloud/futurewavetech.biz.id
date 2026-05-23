 

export const runtime = "edge";

import { Container, Text } from "@chakra-ui/react";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("NotFoundPage");
  return (
    <Container maxW="lg" py={10}>
      <Text textAlign="center">{t("Title")}</Text>
    </Container>
  );
}
