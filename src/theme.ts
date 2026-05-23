import { defineStyle, extendTheme, type ThemeConfig } from "@chakra-ui/react";


const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export default extendTheme({
  config,
  semanticTokens: {
    colors: {
      blue: {
          50: "#e6f4ff",
          100: "#bae0ff",
          200: "#91caff",
          300: "#69b1ff",
          400: "#4096ff",
          500: "#1677ff",
          600: "#0958d9",
          700: "#003eb3",
          800: "#002c8c",
          900: "#001d66",
      },
      bg: {
        default: "#fcfdfe",
        _dark: "#14151e"
      },
      "drawer.dialog.bg": {
        default: "gray.50",
        _dark: "gray.900"
      }
    },
  },
  styles: {
    global: defineStyle({
      "html, body": {
        minHeight: "100%"
      },
      body: {
        minW: "320px",
        bg: "#F5F5F5",
        color: "#666666"
      },
      ".star": {
        "&.full" : {
          background: "url(/static/images/star/star.png) no-repeat",
          backgroundSize: "auto 100%"
        },
        "&.empty" : {
          background: "url(/static/images/star/empty-star.png) no-repeat",
          backgroundSize: "auto 100%"
        },
        "&.half" : {
          background: "url('/static/images/star/half-star.png') no-repeat, url('/static/images/star/empty-star.png') no-repeat",
          backgroundSize: "auto 100%, auto 100%"
        }
      },
      "ins.adsbygoogle[data-ad-status='unfilled']": {
        display: 'none'
      },
      "#description a" : {
        color: "cyan.500"
      }
    }),
  },
});
