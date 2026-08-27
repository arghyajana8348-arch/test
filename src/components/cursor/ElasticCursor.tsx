"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { cn } from "../../utils/cn";
import { useMediaQuery } from "../../hooks/use-media-query";

function useTicker(callback: () => void, paused: boolean) {
  useEffect(() => {
    if (!paused && callback) {
      gsap.ticker.add(callback);
    }
    return () => {
      gsap.ticker.remove(callback);
    };
  }, [callback, paused]);
}

function useInstance<T>(create: () => T): T {
  const ref = useRef<T | null>(null);
  if (ref.current === null) ref.current = create();
  return ref.current;
}

function getScale(diffX: number, diffY: number) {
  const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  return Math.min(distance / 735, 0.35);
}

function getAngle(diffX: number, diffY: number) {
  return (Math.atan2(diffY, diffX) * 180) / Math.PI;
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CURSOR_DIAMETER = 50;
const WRAP_PADDING = 8;
const WRAP_RADIUS = 12;
const WRAP_EASE = 0.2;
const TARGET_PULL = 0.35;
const TARGET_EASE = 0.25;
const TARGET_MAX_PULL = 12;
const CURSOR_PARALLAX = 0.12;
const CURSOR_MAX_LEAD = 10;

const wrapsTarget = true;
const movesTarget = true;

type Base = {
  left: number;
  top: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
};

type ActiveTarget = {
  el: HTMLElement | null;
  base: Base | null;
  offX: number;
  offY: number;
};

type Setters = Record<string, (val: number | string) => void>;

function measure(el: HTMLElement): Base {
  const r = el.getBoundingClientRect();
  return {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height,
    cx: r.left + r.width / 2,
    cy: r.top + r.height / 2,
  };
}

export interface ElasticCursorProps {
  /** Force disable cursor */
  disabled?: boolean;
  /** Pass loading state if using a site loader */
  isLoading?: boolean;
  /** Pass loading percentage (0-100) if using a site loader */
  loadingPercent?: number;
  /** CSS class to identify interactive elements that trigger magnetic wrapping */
  hoverClassName?: string;
  /** Attribute to disable custom cursor when hovering specific zones (e.g. chat/inputs) */
  noCursorAttribute?: string;
}

export default function ElasticCursor({
  disabled = false,
  isLoading = false,
  loadingPercent = 100,
  hoverClassName = "cursor-can-hover",
  noCursorAttribute = "data-no-custom-cursor",
}: ElasticCursorProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const jellyRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [cursorMoved, setCursorMoved] = useState(false);
  const cursorMovedRef = useRef(false);
  const isHiddenRef = useRef(false);

  const pos = useInstance(() => ({ x: 0, y: 0 }));
  const vel = useInstance(() => ({ x: 0, y: 0 }));
  const pointer = useInstance(() => ({ x: 0, y: 0 }));
  const jelly = useInstance(() => ({
    x: 0,
    y: 0,
    w: CURSOR_DIAMETER,
    h: CURSOR_DIAMETER,
    r: CURSOR_DIAMETER / 2,
    sx: 1,
    sy: 1,
  }));

  const active = useInstance<ActiveTarget>(() => ({
    el: null,
    base: null,
    offX: 0,
    offY: 0,
  }));
  const set = useInstance<Setters>(() => ({}));

  useLayoutEffect(() => {
    const jellyEl = jellyRef.current;
    const dotEl = dotRef.current;
    if (!jellyEl || !dotEl) return;

    gsap.set(jellyEl, { xPercent: -50, yPercent: -50 });
    gsap.set(dotEl, { xPercent: -50, yPercent: -50 });

    set.x = gsap.quickSetter(jellyEl, "x", "px") as any;
    set.y = gsap.quickSetter(jellyEl, "y", "px") as any;
    set.r = gsap.quickSetter(jellyEl, "rotate", "deg") as any;
    set.sx = gsap.quickSetter(jellyEl, "scaleX") as any;
    set.sy = gsap.quickSetter(jellyEl, "scaleY") as any;
    set.width = gsap.quickSetter(jellyEl, "width", "px") as any;
    set.height = gsap.quickSetter(jellyEl, "height", "px") as any;
    set.radius = gsap.quickSetter(jellyEl, "borderRadius", "px") as any;
    set.opacity = gsap.quickSetter(jellyEl, "opacity") as any;
    set.dotX = gsap.quickSetter(dotEl, "x", "px") as any;
    set.dotY = gsap.quickSetter(dotEl, "y", "px") as any;
    set.dotOpacity = gsap.quickSetter(dotEl, "opacity") as any;
  }, [isMobile, disabled]);

  const render = useCallback(() => {
    if (!set.x) return;

    set.dotX(pointer.x);
    set.dotY(pointer.y);

    const el = active.el;
    const wrapping = !!el && wrapsTarget;
    const moveTarget = !!el && movesTarget;
    const hidden = isHiddenRef.current;

    if (moveTarget && el && active.base) {
      const b = active.base;
      const pullX = clamp(
        (pointer.x - b.cx) * TARGET_PULL,
        -TARGET_MAX_PULL,
        TARGET_MAX_PULL
      );
      const pullY = clamp(
        (pointer.y - b.cy) * TARGET_PULL,
        -TARGET_MAX_PULL,
        TARGET_MAX_PULL
      );
      active.offX = lerp(active.offX, pullX, TARGET_EASE);
      active.offY = lerp(active.offY, pullY, TARGET_EASE);
      gsap.set(el, { x: active.offX, y: active.offY });
    }

    if (wrapping && active.base) {
      const b = active.base;
      const leadX = clamp(
        (pointer.x - b.cx) * CURSOR_PARALLAX,
        -CURSOR_MAX_LEAD,
        CURSOR_MAX_LEAD
      );
      const leadY = clamp(
        (pointer.y - b.cy) * CURSOR_PARALLAX,
        -CURSOR_MAX_LEAD,
        CURSOR_MAX_LEAD
      );
      const tx = b.cx + active.offX + leadX;
      const ty = b.cy + active.offY + leadY;

      jelly.x = lerp(jelly.x, tx, WRAP_EASE);
      jelly.y = lerp(jelly.y, ty, WRAP_EASE);
      jelly.w = lerp(jelly.w, b.width + WRAP_PADDING * 2, WRAP_EASE);
      jelly.h = lerp(jelly.h, b.height + WRAP_PADDING * 2, WRAP_EASE);
      jelly.r = lerp(jelly.r, WRAP_RADIUS, WRAP_EASE);
      jelly.sx = lerp(jelly.sx, 1, 0.3);
      jelly.sy = lerp(jelly.sy, 1, 0.3);

      set.x(jelly.x);
      set.y(jelly.y);
      set.width(jelly.w);
      set.height(jelly.h);
      set.radius(jelly.r);
      set.sx(jelly.sx);
      set.sy(jelly.sy);
      set.r(0);
      set.opacity(hidden ? 0 : 1);
      set.dotOpacity(0);
    } else {
      const rotation = getAngle(vel.x, vel.y);
      const scale = getScale(vel.x, vel.y);
      jelly.x = pos.x;
      jelly.y = pos.y;
      jelly.w = lerp(jelly.w, CURSOR_DIAMETER + scale * 300, 0.4);
      jelly.h = lerp(jelly.h, CURSOR_DIAMETER, 0.4);
      jelly.r = lerp(jelly.r, CURSOR_DIAMETER / 2, 0.4);
      jelly.sx = 1 + scale;
      jelly.sy = 1 - scale * 2;

      set.x(pos.x);
      set.y(pos.y);
      set.width(jelly.w);
      set.height(jelly.h);
      set.radius(jelly.r);
      set.r(rotation);
      set.sx(jelly.sx);
      set.sy(jelly.sy);
      set.opacity(hidden ? 0 : 1);
      set.dotOpacity(hidden ? 0 : 1);
    }
  }, []);

  useEffect(() => {
    if (isMobile || disabled) return;

    const onMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!cursorMovedRef.current) {
        cursorMovedRef.current = true;
        setCursorMoved(true);
      }
      gsap.to(pos, {
        x: e.clientX,
        y: e.clientY,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        onUpdate: () => {
          vel.x = (e.clientX - pos.x) * 1.2;
          vel.y = (e.clientY - pos.y) * 1.2;
        },
      });

      const hide = !!(e.target as Element | null)?.closest?.(
        `[${noCursorAttribute}="true"]`
      );
      isHiddenRef.current = hide;
      document.body.style.cursor = hide ? "auto" : "";
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile, disabled, noCursorAttribute]);

  useEffect(() => {
    if (isMobile || disabled) return;

    const acquire = (el: HTMLElement) => {
      gsap.killTweensOf(el);
      active.el = el;
      active.base = measure(el);
      active.offX = 0;
      active.offY = 0;
      jelly.x = pos.x;
      jelly.y = pos.y;
      if (movesTarget) el.style.willChange = "transform";
    };

    const release = () => {
      const el = active.el;
      if (el && movesTarget) {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.35)",
          clearProps: "transform",
          onComplete: () => {
            el.style.willChange = "";
          },
        });
      }
      active.el = null;
      active.base = null;
      active.offX = 0;
      active.offY = 0;
    };

    const onOver = (e: Event) => {
      const target = e.target as Element | null;
      if (target?.closest?.(`[${noCursorAttribute}="true"]`)) {
        if (active.el) release();
        return;
      }
      const t = target?.closest?.(`.${hoverClassName}`) as HTMLElement | null;
      if (t === active.el) return;
      if (active.el) release();
      if (t) acquire(t);
    };

    const onLeave = () => {
      if (active.el) release();
    };

    const onScroll = () => {
      if (!active.el || !active.base) return;
      const r = active.el.getBoundingClientRect();
      active.base.left = r.left - active.offX;
      active.base.top = r.top - active.offY;
      active.base.width = r.width;
      active.base.height = r.height;
      active.base.cx = active.base.left + r.width / 2;
      active.base.cy = active.base.top + r.height / 2;
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (active.el) release();
    };
  }, [isMobile, disabled, hoverClassName, noCursorAttribute]);

  useEffect(() => {
    if (!jellyRef.current || !isLoading) return;
    jellyRef.current.style.height = "2rem";
    jellyRef.current.style.borderRadius = "1rem";
    jellyRef.current.style.width = loadingPercent * 2 + "vw";
  }, [loadingPercent, isLoading]);

  useTicker(render, isLoading || !cursorMoved || isMobile || disabled);

  if (isMobile || disabled) return null;

  return (
    <>
      <div
        ref={jellyRef}
        className={cn(
          "jelly-blob fixed left-0 top-0 border-2 border-indigo-400 dark:border-white pointer-events-none will-change-transform"
        )}
        style={{
          width: CURSOR_DIAMETER,
          height: CURSOR_DIAMETER,
          borderRadius: CURSOR_DIAMETER / 2,
          boxSizing: "border-box",
          zIndex: 9999,
          backdropFilter: "invert(100%)",
        }}
      />
      <div
        ref={dotRef}
        className="w-3 h-3 rounded-full fixed left-0 top-0 pointer-events-none will-change-transform bg-indigo-500"
        style={{
          opacity: 0,
          backdropFilter: "invert(100%)",
          zIndex: 10000,
        }}
      />
    </>
  );
}
