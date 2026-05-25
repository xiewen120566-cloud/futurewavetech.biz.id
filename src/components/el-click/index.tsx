"use client";

import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useMemo } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type AdData = {
  adContainerId: string | null;
  googleQueryId: string | null;
  adClickTime: number;
  publisherId: string | null;
  adk: string | null;
  adf: string | null;
  slotname: string | null;
  adSize: string | null;
};

const AD_CONTAINER_SELECTOR =
  "[id^='div-gpt-ad-'], .gpt-slot, .adsbygoogle, .ad-placeholder";

// 自定义的 useEffectEvent 钩子，用于添加和移除事件监听器
function useEffectEvent(eventType: string, callback: (event: Event) => void) {
  useEffect(() => {
    window.addEventListener(eventType, callback);
    return () => {
      window.removeEventListener(eventType, callback);
    };
  }, [callback, eventType]);
}

const ElClick: React.FC = () => {
  const isBlurTriggered = useRef<boolean>(false);
  const isBeforeUnloadHandled = useRef<boolean>(false);
  const lastTrackedRef = useRef<{ signature: string; time: number } | null>(null);

  const buildAdData = useCallback(
    (adContainer: Element | null, iframe: HTMLIFrameElement | null): AdData | null => {
      try {
        if (!adContainer || !iframe) return null;

        const iframeSrc = iframe.getAttribute("src");
        if (!iframeSrc) return null;

        const formatIframeSrc = new URL(iframeSrc, window.location.href);
        const iframeSearchParams = new URLSearchParams(formatIframeSrc.search);
        const slotId =
          adContainer.getAttribute("id") ??
          (
            adContainer.querySelector?.(
              ".gpt-slot[id], [id^='div-gpt-ad-']"
            ) as HTMLElement | null
          )?.getAttribute("id") ??
          null;

        return {
          adContainerId: slotId,
          googleQueryId: iframe.getAttribute("data-google-query-id"),
          adClickTime: Date.now(),
          publisherId: iframeSearchParams.get("client"),
          adk: iframeSearchParams.get("adk"),
          adf: iframeSearchParams.get("adf"),
          slotname: iframeSearchParams.get("slotname"),
          adSize: iframeSearchParams.get("format"),
        };
      } catch (error) {
        console.error("Error collecting ad data:", error);
        return null;
      }
    },
    []
  );

  const collectAdDataFromElement = useCallback(
    (element: Element | null) => {
      if (!element) return null;

      const adContainer = element.closest(AD_CONTAINER_SELECTOR);
      if (!adContainer) return null;

      const iframe =
        adContainer instanceof HTMLIFrameElement
          ? adContainer
          : (adContainer.querySelector("iframe") as HTMLIFrameElement | null);

      return buildAdData(adContainer, iframe);
    },
    [buildAdData]
  );

  const collectAdData = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement | null;
    if (!activeElement) return null;
    return collectAdDataFromElement(activeElement);
  }, [collectAdDataFromElement]);

  const reportAdClick = useCallback(
    (sourceEvent: string, adData: AdData | null) => {
      if (!adData) return;

      const signature = `${adData.adContainerId ?? "unknown"}:${adData.googleQueryId ?? "unknown"}`;
      const now = Date.now();
      if (
        lastTrackedRef.current &&
        lastTrackedRef.current.signature === signature &&
        now - lastTrackedRef.current.time < 1500
      ) {
        return;
      }

      lastTrackedRef.current = { signature, time: now };

      window.gtag?.("event", "ad_click", {
        event_category: "advertising",
        event_label: adData.slotname ?? adData.adContainerId ?? "unknown",
        source_event: sourceEvent,
        ad_container_id: adData.adContainerId ?? undefined,
        google_query_id: adData.googleQueryId ?? undefined,
        publisher_id: adData.publisherId ?? undefined,
        adk: adData.adk ?? undefined,
        adf: adData.adf ?? undefined,
        slot_name: adData.slotname ?? undefined,
        ad_size: adData.adSize ?? undefined,
      });
      window.ttq?.track?.("ClickButton");
    },
    []
  );

  const trackAdClick = useCallback(() => {
    reportAdClick("visibilitychange", collectAdData());
  }, [collectAdData, reportAdClick]);

  const debouncedTrackAdClick = useMemo(
    () => debounce(trackAdClick, 500),
    [trackAdClick]
  );

  const handleBeforeUnload = useCallback(
    () => {
      if (isBeforeUnloadHandled.current) return;
      const adData = collectAdData();
      if (adData) {
        reportAdClick("beforeunload", adData);
        isBeforeUnloadHandled.current = true;
      }
    },
    [collectAdData, reportAdClick]
  );

  const handleBlur = useCallback(() => {
    const activeElement = document.activeElement as HTMLIFrameElement | null;
    if (activeElement?.tagName === "IFRAME") {
      isBlurTriggered.current = true;
      setTimeout(() => {
        reportAdClick("blur", collectAdData());
      }, 0);
      setTimeout(() => {
        isBlurTriggered.current = false;
      }, 300);
    }
  }, [collectAdData, reportAdClick]);

  const handleVisibilityChange = useCallback(
    () => {
      if (document.visibilityState === "hidden" && isBlurTriggered.current) {
        debouncedTrackAdClick();
      }
    },
    [debouncedTrackAdClick]
  );

  // 使用自定义的 useEffectEvent 钩子添加事件监听器
  useEffectEvent("beforeunload", handleBeforeUnload);
  useEffectEvent("blur", handleBlur);
  useEffectEvent("visibilitychange", handleVisibilityChange);

  useEffect(() => {
    const handler = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      reportAdClick("pointerdown", collectAdDataFromElement(target));
    };

    window.addEventListener("pointerdown", handler, true);
    return () => window.removeEventListener("pointerdown", handler, true);
  }, [collectAdDataFromElement, reportAdClick]);

  return null; // This component does not render anything
};

export default ElClick;
