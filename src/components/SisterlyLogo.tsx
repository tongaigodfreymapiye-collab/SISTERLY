import { cn } from "@/lib/utils";

type SisterlyLogoProps = {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  tagline?: boolean;
  dark?: boolean;
};

const SisterlyLogo = ({ size = 40, className, showWordmark = false, tagline = false, dark = false }: SisterlyLogoProps) => (
  <span className={cn("inline-flex items-center gap-2.5", className)}>
    <img src={`${import.meta.env.BASE_URL}sisterly-mark.svg`} alt="SISTERLY emblem" width={size} height={size} className="shrink-0 rounded-full shadow-soft" />
    {showWordmark && <span className="flex flex-col leading-tight">
      <span className={cn("font-serif font-bold tracking-[.035em]", dark ? "text-white" : "text-foreground")}>SISTERLY</span>
      {tagline && <span className={cn("text-[10px] sm:text-xs font-sans", dark ? "text-white/75" : "text-muted-foreground")}>Your Women’s Health Companion</span>}
    </span>}
  </span>
);

export default SisterlyLogo;
