import { useEffect, useRef, useState } from 'react';

type Point = { lng: number; lat: number };

const DURATION_MS = 500;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/**
 * Smoothly interpolates toward the latest target point when lng/lat change.
 */
export function useAnimatedLatLng(target: Point | null): Point | null {
  const [current, setCurrent] = useState<Point | null>(null);
  const displayRef = useRef<Point | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!target) {
      displayRef.current = null;
      setCurrent(null);
      return;
    }

    cancelAnimationFrame(rafRef.current);

    if (!displayRef.current) {
      displayRef.current = target;
      setCurrent(target);
      return;
    }

    const from = displayRef.current;
    if (from.lng === target.lng && from.lat === target.lat) {
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION_MS);
      const eased = easeOutCubic(t);
      const next: Point = {
        lng: lerp(from.lng, target.lng, eased),
        lat: lerp(from.lat, target.lat, eased),
      };
      displayRef.current = next;
      setCurrent(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [target?.lng, target?.lat]);

  return current;
}
