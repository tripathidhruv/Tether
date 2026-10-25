"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ anchors: { offset: -24 }, lerp: 0.12 }}>
      {children}
    </ReactLenis>
  );
}
