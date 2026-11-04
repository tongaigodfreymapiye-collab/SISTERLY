import { cn } from "@/lib/utils";
import { Baby, Calendar, Heart } from "lucide-react";

interface PregnancyWeekCardProps {
  week: number;
  day: number;
  trimester: number;
  daysRemaining: number;
  babySize: string;
  className?: string;
}

const PregnancyWeekCard = ({ week, day, trimester, daysRemaining, babySize, className }: PregnancyWeekCardProps) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl gradient-pregnancy p-6 shadow-elevated",
      className
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-lavender/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blush/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <p className="text-xs font-sans font-medium text-plum/60 uppercase tracking-wider mb-1">
          Your pregnancy journey
        </p>
        <h3 className="text-3xl font-serif font-bold text-plum">
          Week {week}, Day {day}
        </h3>
        <p className="text-sm font-sans text-plum/70 mt-1">Trimester {trimester}</p>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-3 text-center">
            <Calendar className="w-4 h-4 text-lavender mx-auto mb-1" />
            <p className="text-lg font-serif font-bold text-plum">{daysRemaining}</p>
            <p className="text-[10px] font-sans text-plum/60">days left</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-3 text-center">
            <Baby className="w-4 h-4 text-blush mx-auto mb-1" />
            <p className="text-sm font-serif font-bold text-plum">{babySize}</p>
            <p className="text-[10px] font-sans text-plum/60">baby size</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-3 text-center">
            <Heart className="w-4 h-4 text-blush mx-auto mb-1" />
            <p className="text-lg font-serif font-bold text-plum">{week}/40</p>
            <p className="text-[10px] font-sans text-plum/60">weeks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnancyWeekCard;
