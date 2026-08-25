"use client"

import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular"
  animation?: "pulse" | "wave" | "none"
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rectangular", animation = "pulse", ...props }, ref) => {
    const baseStyles =
      "bg-[var(--color-bg-tertiary)] rounded overflow-hidden border border-[var(--color-border-subtle)] shadow-[var(--shadow-inner)]"
    const animations = {
      pulse: "animate-pulse-holo",
      wave: "animate-skeleton-wave",
      none: "",
    }

    const variants = {
      text: "h-4 w-full max-w-xs",
      circular: "rounded-full aspect-square",
      rectangular: "rounded-lg",
    }

    // Inject holographic shimmer + legacy wave styles once.
    useEffect(() => {
      const styleSheet = document.createElement("style")
      styleSheet.textContent = `
        @keyframes skeleton-holo {
          0%   { background-position: -200% 0; box-shadow: inset 0 0 0 0 rgba(0,212,255,0); }
          50%  { box-shadow: inset 0 0 14px rgba(0,212,255,0.18); }
          100% { background-position: 200% 0; box-shadow: inset 0 0 0 0 rgba(0,212,255,0); }
        }
        .animate-pulse-holo {
          background-image: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 212, 255, 0.12) 40%,
            rgba(0, 212, 255, 0.22) 50%,
            rgba(0, 212, 255, 0.12) 60%,
            transparent 100%
          );
          background-size: 200% 100%;
          background-repeat: no-repeat;
          animation: skeleton-holo 2.4s ease-in-out infinite;
        }
        @keyframes skeleton-wave {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-skeleton-wave {
          background: linear-gradient(
            90deg,
            var(--color-bg-tertiary) 25%,
            var(--color-border-default) 50%,
            var(--color-bg-tertiary) 75%
          );
          background-size: 200% 100%;
          animation: skeleton-wave 1.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-holo,
          .animate-skeleton-wave {
            animation: none;
          }
          .animate-pulse-holo {
            background-image: linear-gradient(
              90deg,
              rgba(0, 212, 255, 0.08) 0%,
              rgba(0, 212, 255, 0.14) 100%
            );
            background-size: 100% 100%;
          }
        }
      `
      document.head.appendChild(styleSheet)
      return () => {
        document.head.removeChild(styleSheet)
      }
    }, [])

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], animations[animation], className)}
        {...props}
      />
    )
  }
)

Skeleton.displayName = "Skeleton"