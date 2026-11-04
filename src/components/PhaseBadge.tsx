import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Phase = "menstrual" | "follicular" | "ovulation" | "luteal";

const phaseConfig: Record<Phase, { label: string; className: string }> = {
  menstrual: { label: "Menstrual", className: "bg-blush/20 text-blush border-blush/30" },
  follicular: { label: "Follicular", className: "bg-petal/40 text-plum border-petal/50" },
  ovulation: { label: "Ovulation", className: "bg-lavender/20 text-lavender border-lavender/30" },
  luteal: { label: "Luteal", className: "bg-royal/10 text-royal border-royal/20" },
};

const PhaseBadge = forwardRef<HTMLSpanElement, { phase: Phase; className?: string }>(
  ({ phase, className }, ref) => {
    const config = phaseConfig[phase];
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-semibold border",
          config.className,
          className
        )}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full mr-1.5",
            phase === "menstrual" && "bg-blush",
            phase === "follicular" && "bg-petal",
            phase === "ovulation" && "bg-lavender",
            phase === "luteal" && "bg-royal"
          )}
        />
        {config.label}
      </span>
    );
  }
);
PhaseBadge.displayName = "PhaseBadge";

export default PhaseBadge;
