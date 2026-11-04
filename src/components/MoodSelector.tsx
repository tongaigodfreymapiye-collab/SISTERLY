import { cn } from "@/lib/utils";
import { useState } from "react";

const moods = [
  { emoji: "😊", label: "Happy", color: "bg-petal" },
  { emoji: "😌", label: "Calm", color: "bg-lavender/20" },
  { emoji: "😴", label: "Tired", color: "bg-muted" },
  { emoji: "😤", label: "Irritable", color: "bg-blush/30" },
  { emoji: "😢", label: "Sad", color: "bg-royal/10" },
  { emoji: "🥰", label: "Loving", color: "bg-petal/60" },
];

interface MoodSelectorProps {
  onSelect?: (mood: string) => void;
  className?: string;
}

const MoodSelector = ({ onSelect, className }: MoodSelectorProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-sans font-medium text-muted-foreground">How are you feeling today?</p>
      <div className="grid grid-cols-3 gap-2">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => {
              setSelected(mood.label);
              onSelect?.(mood.label);
            }}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 border-2",
              selected === mood.label
                ? "border-lavender shadow-soft scale-105 " + mood.color
                : "border-transparent bg-muted/50 hover:bg-muted"
            )}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs font-sans font-medium text-foreground">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
