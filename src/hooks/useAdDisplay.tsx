import { useEffect, useRef } from "react";

// Custom hook to monitor ad display status and iframe visibility with a countdown
const useAdDisplay = (selector: string) => {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const remainingTimeRef = useRef<number>(1000); // Initial countdown time in milliseconds
  const startTimestampRef = useRef<number | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const el = document.querySelector(selector);
    if (!el) return;

    const handleMutation = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-ad-status"
        ) {
          const status = (mutation.target as HTMLElement).getAttribute(
            "data-ad-status"
          );
          if (status === "filled") {
            const iframe = el.querySelector("iframe");
            if (iframe) {
              setupIntersectionObserver(iframe);
            }
            mutationObserverRef.current?.disconnect();
          }
          break;
        }
      }
    };

    const setupIntersectionObserver = (iframe: HTMLIFrameElement) => {
      intersectionObserverRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCountdown(iframe);
          } else {
            pauseCountdown();
          }
        });
      }, { threshold: 0.1 });

      intersectionObserverRef.current.observe(iframe);
    };

    const startCountdown = (iframe: HTMLIFrameElement) => {
      startTimestampRef.current = Date.now();
      timeoutIdRef.current = setTimeout(() => {
        onCountdownEnd(iframe);
      }, remainingTimeRef.current);
    };

    const pauseCountdown = () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
        if (startTimestampRef.current) {
          remainingTimeRef.current -= Date.now() - startTimestampRef.current;
          startTimestampRef.current = null;
        }
      }
    };

    const onCountdownEnd = (iframe: HTMLIFrameElement) => {
      const adContainer = document.querySelector(selector);
      if (adContainer) {
        const iframeSrc = iframe.getAttribute("src");
        if (iframeSrc) {
          // const formatIframeSrc = new URL(iframeSrc);
          // const iframeSearchParams = new URLSearchParams(formatIframeSrc.search);
          // window.umami.track((props) => ({
          //   ...props,
          //   name: "adView",
          //   data: {
          //     adContainerId: adContainer.getAttribute("id"),
          //     googleQueryId: iframe.getAttribute("data-google-query-id"),
          //     adDisplayTime: Date.now(),
          //     publisherId: iframeSearchParams.get("client"),
          //     adk: iframeSearchParams.get("adk"),
          //     adf: iframeSearchParams.get("adf"),
          //     slotname: iframeSearchParams.get("slotname"),
          //     adSize: iframeSearchParams.get("format"),
          //   },
          // }));
          window.ttq.track("ViewContent");
        }
      }
      cleanup();
    };

    const cleanup = () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      intersectionObserverRef.current?.disconnect();
      mutationObserverRef.current?.disconnect();
    };

    mutationObserverRef.current = new MutationObserver(handleMutation);
    mutationObserverRef.current.observe(el, {
      attributes: true,
      attributeOldValue: true,
    });

    return cleanup;
  }, [selector]);

  return null;
};

export default useAdDisplay;
