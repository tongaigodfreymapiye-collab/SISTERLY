import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";

interface InsightCardProps {
  title: string;
  value?: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  variant?: "default" | "blush" | "lavender" | "royal";
  children?: ReactNode;
}

const InsightCard = forwardRef<HTMLDivElement, InsightCardProps>(
  ({ title, value, subtitle, icon, className, variant = "default", children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:shadow-elevated",
        {
          "bg-card shadow-card": variant === "default",
          "bg-gradient-to-br from-petal to-card shadow-soft": variant === "blush",
          "gradient-fertility shadow-soft": variant === "lavender",
          "gradient-cta text-primary-foreground": variant === "royal",
        },
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className={cn(
            "text-sm font-sans font-medium mb-1",
            variant === "royal" ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            {title}
          </p>
          {value && (
            <p className="text-2xl font-serif font-semibold tracking-tight">{value}</p>
          )}
          {subtitle && (
            <p className={cn(
              "text-xs font-sans mt-1",
              variant === "royal" ? "text-primary-foreground/60" : "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center",
            variant === "royal" ? "bg-white/10" : "bg-muted"
          )}>
            {icon}
          </div>
        )}
      </div>
      {children}
    </div>
  );
  }
);
InsightCard.displayName = "InsightCard";

export default InsightCard;

