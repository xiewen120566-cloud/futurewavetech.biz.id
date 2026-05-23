"use client";

import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useMemo } from "react";

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

  const collectAdData = useCallback(() => {
    try {
      const activeElement = document.activeElement as HTMLIFrameElement | null;
      if (!activeElement || activeElement.tagName !== "IFRAME") return null;

      const adContainer = activeElement.closest(".adsbygoogle");
      const iframeSrc = activeElement.getAttribute("src");
      if (adContainer && iframeSrc) {
        const formatIframeSrc = new URL(iframeSrc)
        const iframeSearchParams = new URLSearchParams(formatIframeSrc.search)
        return {
          adContainerId: adContainer.getAttribute("id"),
          googleQueryId: activeElement.getAttribute("data-google-query-id"),
          adClickTime: Date.now(),
          publisherId: iframeSearchParams.get("client"),
          adk: iframeSearchParams.get("adk"),
          adf: iframeSearchParams.get("adf"),
          slotname: iframeSearchParams.get("slotname"),
          adSize: iframeSearchParams.get("format")
        };
      }
      return null;
    } catch (error) {
      console.error("Error collecting ad data:", error);
      return null;
    }
  }, []);

  const trackAdClick = useCallback(() => {
    const adData = collectAdData();
    if (adData) {
      // window.umami.track((props) => ({
      //   ...props,
      //   name: "adClick",
      //   event: "visibilitychange",
      //   data: {
      //     ...adData,
      //   },
      // }));
      window.ttq.track("ClickButton");
    }
  }, [collectAdData]);

  const debouncedTrackAdClick = useMemo(
    () => debounce(trackAdClick, 500),
    [trackAdClick]
  );

  const handleBeforeUnload = useCallback(
    () => {
      if (isBeforeUnloadHandled.current) return;
      const adData = collectAdData();
      if (adData) {
        // 上报数据
        // window.umami.track((props) => ({
        //   ...props,
        //   name: "adClick",
        //   event: "beforeunload",
        //   data: {
        //     ...adData,
        //   },
        // }));
        window.ttq.track("ClickButton");
        console.log(JSON.stringify(adData));
        // 使用更简洁的方式触发像素跟踪
        isBeforeUnloadHandled.current = true;
      }
    },
    [collectAdData]
  );

  const handleBlur = useCallback(() => {
    const activeElement = document.activeElement as HTMLIFrameElement | null;
    if (activeElement?.tagName === "IFRAME") {
      isBlurTriggered.current = true;
      setTimeout(() => {
        isBlurTriggered.current = false;
      }, 300);
    }
  }, []);

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

  return null; // This component does not render anything
};

export default ElClick;
