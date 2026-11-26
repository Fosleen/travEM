"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import Button from "@/components/atoms/Button";
import {
  defaultHeroCrop,
  type HeroCrop,
  type HeroDevice,
  type HeroImageCrop,
} from "@/utils/heroImageCrop";

type PreviewProps = {
  url: string;
  crop: HeroImageCrop;
  editable: boolean;
  onChange: (device: HeroDevice, crop: HeroCrop) => void;
};

const controls = [
  { field: "zoom", label: "Zum", min: 1, max: 3, step: 0.01 },
  { field: "x", label: "Vodoravni položaj", min: 0, max: 100, step: 1 },
  { field: "y", label: "Okomiti položaj", min: 0, max: 100, step: 1 },
] as const;

const mobileSizes = [
  [414, 896], [384, 832], [360, 780], [393, 852], [402, 874],
  [390, 844], [412, 892], [440, 956], [393, 873], [430, 932],
] as const;

const clampPosition = (value: number) => Math.max(0, Math.min(100, value));

function PreviewFrame({
  label, width, height, device, url, crop, editable, onChange, sizeControl,
}: PreviewProps & {
  label: string;
  width: number;
  height: number;
  device: HeroDevice;
  sizeControl?: ReactNode;
}) {
  const figure = useRef<HTMLElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const drag = useRef<{
    pointer: number; x: number; y: number; travelX: number; travelY: number; crop: HeroCrop;
  } | null>(null);
  const [scale, setScale] = useState(0);
  const frameCrop = crop[device];

  const sendPreview = useCallback(() => {
    iframe.current?.contentWindow?.postMessage(
      { type: "hero-preview-update", url, crop },
      window.location.origin
    );
  }, [url, crop]);

  useEffect(() => {
    const onReady = (event: MessageEvent) => {
      if (event.origin === window.location.origin &&
          event.source === iframe.current?.contentWindow &&
          event.data?.type === "hero-preview-ready") sendPreview();
    };
    window.addEventListener("message", onReady);
    sendPreview();
    return () => window.removeEventListener("message", onReady);
  }, [sendPreview]);

  useEffect(() => {
    const element = figure.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    const image = iframe.current?.contentDocument?.querySelector<HTMLImageElement>(".homepage-image-mask img");
    if (!image?.naturalWidth || !image.clientWidth || !image.clientHeight || !scale) return;

    const cover = Math.max(image.clientWidth / image.naturalWidth, image.clientHeight / image.naturalHeight);
    drag.current = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      travelX: Math.max(0, image.naturalWidth * cover * frameCrop.zoom - image.clientWidth) * scale,
      travelY: Math.max(0, image.naturalHeight * cover * frameCrop.zoom - image.clientHeight) * scale,
      crop: frameCrop,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start || start.pointer !== event.pointerId) return;
    onChange(device, {
      zoom: start.crop.zoom,
      x: start.travelX > 0.01 ? clampPosition(start.crop.x - (event.clientX - start.x) * 100 / start.travelX) : start.crop.x,
      y: start.travelY > 0.01 ? clampPosition(start.crop.y - (event.clientY - start.y) * 100 / start.travelY) : start.crop.y,
    });
  };

  return (
    <figure ref={figure}>
      <figcaption>
        <span>{label}</span>
        {sizeControl ?? <span className="hero-crop-size">{width} px</span>}
      </figcaption>
      <div className="hero-crop-viewport" style={{ width: width * scale, height: height * scale }}>
        <iframe
          ref={iframe}
          title={`Izrez naslovne fotografije · ${label}`}
          src="/hero-preview"
          onLoad={sendPreview}
          tabIndex={-1}
          width={width}
          height={height}
          style={{ transform: `scale(${scale})` }}
        />
        {editable && (
          <div
            className="hero-crop-drag"
            aria-hidden="true"
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onLostPointerCapture={() => { drag.current = null; }}
          />
        )}
      </div>
      {editable && (
        <fieldset className="hero-crop-controls">
          <legend>Kadar za {device === "desktop" ? "desktop" : "mobitel"}</legend>
          {controls.map(({ field, label: controlLabel, min, max, step }) => {
            const value = frameCrop[field];
            const percent = (value - min) / (max - min) * 100;
            const display = `${Math.round(field === "zoom" ? value * 100 : value)}%`;
            return (
              <label key={field}>
                <span>{controlLabel}</span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  aria-valuetext={display}
                  style={{ "--hero-crop-fill": `${percent}%` } as CSSProperties}
                  onChange={(event) => onChange(device, { ...frameCrop, [field]: event.target.valueAsNumber })}
                />
                <span className="hero-crop-value" aria-hidden="true">{display}</span>
              </label>
            );
          })}
          <Button edit onClick={() => onChange(device, defaultHeroCrop)}>
            Vrati početni kadar
          </Button>
        </fieldset>
      )}
    </figure>
  );
}

export default function HeroCropPreview({
  url, onShadeChange, ...props
}: PreviewProps & { onShadeChange: (value: number) => void }) {
  const [previewUrl, setPreviewUrl] = useState(url);
  const [mobileSizeIndex, setMobileSizeIndex] = useState(0);
  const [mobileWidth, mobileHeight] = mobileSizes[mobileSizeIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => setPreviewUrl(url), 300);
    return () => window.clearTimeout(timer);
  }, [url]);

  if (!url || !previewUrl) return null;
  const topShade = props.crop.topShade ?? 0;

  return (
    <section aria-label="Pregled izreza">
      {props.editable && <p className="hero-crop-help">Povuci fotografiju ili prilagodi kadar klizačima.</p>}
      {props.editable && (
        <fieldset className="hero-crop-controls hero-crop-shade-controls">
          <legend>Zatamnjenje vrha</legend>
          <label>
            <span>Jačina zatamnjenja</span>
            <input
              type="range"
              min={0}
              max={100}
              value={topShade}
              aria-valuetext={`${topShade}%`}
              style={{ "--hero-crop-fill": `${topShade}%` } as CSSProperties}
              onChange={(event) => onShadeChange(event.target.valueAsNumber)}
            />
            <span className="hero-crop-value" aria-hidden="true">{topShade}%</span>
          </label>
        </fieldset>
      )}
      <div className="hero-crop-previews">
        <PreviewFrame label="Desktop" width={1920} height={1080} device="desktop" url={previewUrl} {...props} />
        <PreviewFrame
          label="Mobitel"
          width={mobileWidth}
          height={mobileHeight}
          device="mobile"
          url={previewUrl}
          sizeControl={
            <select
              className="hero-crop-size-select"
              aria-label="Dimenzije zaslona mobitela"
              value={mobileSizeIndex}
              onChange={(event) => setMobileSizeIndex(Number(event.target.value))}
            >
              {mobileSizes.map(([width, height], index) => (
                <option key={`${width}x${height}`} value={index}>{width} × {height} px</option>
              ))}
            </select>
          }
          {...props}
        />
      </div>
    </section>
  );
}
