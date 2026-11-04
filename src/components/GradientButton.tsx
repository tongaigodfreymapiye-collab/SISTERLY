import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cta" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "cta", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-sans font-semibold transition-all duration-300 rounded-full",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            "gradient-cta text-primary-foreground hover:opacity-90 hover:shadow-elevated": variant === "cta",
            "gradient-accent text-accent-foreground hover:opacity-90 hover:shadow-glow": variant === "accent",
            "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground": variant === "outline",
            "bg-transparent text-foreground hover:bg-muted": variant === "ghost",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";
export default GradientButton;
