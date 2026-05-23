"use client";
import { forwardRef, useEffect, useMemo, useRef } from "react";

type GptSize = [number, number];

type GptCommandFn = () => void;

type GptSlot = {
  addService: (service: unknown) => GptSlot;
};

type GoogletagApi = {
  cmd: GptCommandFn[];
  defineSlot?: (adUnitPath: string, size: GptSize[], divId: string) => GptSlot | null;
  pubads?: () => {
    enableSingleRequest: () => void;
  };
  enableServices?: () => void;
  display?: (divId: string) => void;
  destroySlots?: (slots?: GptSlot[]) => boolean;
};

declare global {
  interface Window {
    googletag?: GoogletagApi;
    __gptServicesEnabled?: boolean;
  }
}

interface AdTemplateProps {
  divId: string;
  className?: string;
  adUnitPath: string;
  sizes: GptSize[];
  minWidth?: number;
  minHeight?: number;
  style?: React.CSSProperties;
}

const ElTemplate = forwardRef<HTMLDivElement, AdTemplateProps>(function AdTemplate(props, ref) {
  const slotRef = useRef<GptSlot | null>(null);
  const sizesKey = useMemo(() => JSON.stringify(props.sizes), [props.sizes]);

  useEffect(() => {
    window.googletag = window.googletag || { cmd: [] };

    const { googletag } = window;
    let cancelled = false;

    googletag.cmd.push(() => {
      if (cancelled) return;

      const pubadsService = googletag.pubads?.();
      if (!pubadsService || !googletag.defineSlot) return;

      const slot = googletag.defineSlot(props.adUnitPath, props.sizes, props.divId);
      if (!slot) return;

      slot.addService(pubadsService);
      slotRef.current = slot;

      if (!window.__gptServicesEnabled) {
        pubadsService.enableSingleRequest();
        googletag.enableServices?.();
        window.__gptServicesEnabled = true;
      }

      googletag.display?.(props.divId);
    });

    return () => {
      cancelled = true;
      const currentSlot = slotRef.current;
      if (!currentSlot) return;

      googletag.cmd.push(() => {
        googletag.destroySlots?.([currentSlot]);
      });
      slotRef.current = null;
    };
  }, [props.adUnitPath, props.divId, props.sizes, sizesKey]);

  return (
    <div
      className="ad-placeholder"
      style={{ textAlign: "center", paddingBlock: 12 }}
    >
      <p>AD</p>
      <div
        ref={ref}
        id={props.divId}
        className={["gpt-slot", props.className].filter(Boolean).join(" ")}
        style={{
          minWidth: props.minWidth ?? 300,
          minHeight: props.minHeight ?? 50,
          marginInline: "auto",
          ...props.style,
        }}
      />
    </div>
  );
});

export default ElTemplate;
