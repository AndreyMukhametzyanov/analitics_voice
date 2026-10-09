"use client";

import { PawPrint } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function SittingCat() {
  return (
    <img
      src="/giphy.gif"
      alt="Кот смотрит в камеру"
      className="h-auto w-32 rounded-xl"
    />
  );
}

type CatMotion = "hidden" | "in" | "shown" | "out";

export function CatCompanion() {
  const [motion, setMotion] = useState<CatMotion>("hidden");
  const [mounted, setMounted] = useState(false);
  const open = motion === "in" || motion === "shown";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-5 right-5 z-40">
      <div
        aria-hidden={!open}
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) {
            return;
          }
          const name = event.animationName;
          setMotion((current) => {
            if (name === "cat-slide-in" && current === "in") {
              return "shown";
            }
            if (name === "cat-slide-out" && current === "out") {
              return "hidden";
            }
            return current;
          });
        }}
        className={`absolute bottom-full right-0 mb-3 ${
          motion === "in" ? "cat-slide-in" : ""
        } ${motion === "out" ? "cat-slide-out" : ""} ${
          motion === "hidden" || motion === "out" ? "pointer-events-none" : ""
        }`}
        style={
          motion === "hidden"
            ? { transform: "translate3d(120%, 0, 0)", opacity: 0 }
            : motion === "shown"
              ? { transform: "translate3d(0, 0, 0)", opacity: 1 }
              : undefined
        }
      >
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-2 shadow-2xl backdrop-blur-md">
          <SittingCat />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400">если грустно нажми</span>
        <button
          type="button"
          aria-label={open ? "Спрятать котика" : "Показать котика"}
          aria-pressed={open}
          onClick={() => {
            setMotion((current) => (current === "hidden" || current === "out" ? "in" : "out"));
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 text-zinc-200 shadow-lg backdrop-blur-md transition hover:bg-white hover:text-zinc-950"
        >
          <PawPrint className="h-5 w-5" />
        </button>
      </div>
    </div>,
    document.body,
  );
}
