import { cn } from "@/lib/utils";

interface AIConfidenceMeterProps {
  confidence: number;
  label?: string;
  className?: string;
}

const AIConfidenceMeter = ({ confidence, label = "AI Confidence", className }: AIConfidenceMeterProps) => {
  const getColor = () => {
    if (confidence >= 80) return "bg-lavender";
    if (confidence >= 60) return "bg-blush";
    return "bg-muted-foreground/40";
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-sans text-muted-foreground">{label}</span>
        <span className="text-xs font-sans font-semibold text-foreground">{confidence}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", getColor())}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <p className="text-[10px] font-sans text-muted-foreground italic">AI-assisted estimate</p>
    </div>
  );
};

export default AIConfidenceMeter;
