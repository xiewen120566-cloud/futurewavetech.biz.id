import dayjs from "dayjs";

import { Box, Container, Text } from "@chakra-ui/react";

export default function Footer() {
  const baseUrlInput = (process.env.BASE_URL ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "");
  const baseUrl = baseUrlInput || "https://adventurewanders.com";
  const normalizedBaseUrl =
    baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : `https://${baseUrl}`;
  const url = new URL(normalizedBaseUrl);

  const hostname = url.hostname.at(0)?.toUpperCase() + url.hostname.slice(1);

  return (
    <Box as="footer" w="full" bg="surface.1" borderTop="1px solid" borderColor="border.subtle">
      <Container maxW="container.xl" p={{ base: 3, md: 4, lg: 6 }}>
        <Text textAlign="center" color="text.muted">
          © {dayjs().format("YYYY")} {hostname}. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}
