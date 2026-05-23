import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import BaseLayout from "@/components/basic-layout";
import { Locale, routing } from "@/i18n/routing";
import { DarkMode } from "@chakra-ui/react";
import Script from "next/script";
import dynamic from "next/dynamic";

export const runtime = "edge";

const ElClick = dynamic(() => import("@/components/el-click/index"), { ssr: false })
interface Props extends PropsWithChildren {
  params: { locale: Locale };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return (
    <BaseLayout locale={locale}>
      <Script
        async
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      {/* <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-0FKCXR93S2"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />

      <Script
        id="googletagmanager-gtag-javascript"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            window.dataLayer.push(arguments)
          }
          gtag('js', new Date());
          gtag('config', 'G-0FKCXR93S2')
          `,
        }}
      /> */}
      {/* ttq 像素追踪  */}
      <Script
        id="tiktok-pixel-javascript"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


  ttq.load('D885MRRC77UEB8QVUHSG');
  ttq.page();
}(window, document, 'ttq');
          `,
        }}
      />
      {/* <Script async strategy="afterInteractive" src="https://analytics.xxx.org/script.js" data-website-id="d9790303-4023-4b67-9fa1-ec7dc1"/> */}
      <DarkMode>{children}</DarkMode>
      <ElClick />
    </BaseLayout>
  );
}
