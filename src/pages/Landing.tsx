import { Link } from "react-router-dom";
import GradientButton from "@/components/GradientButton";
import WombAnimation from "@/components/WombAnimation";
import SisterlyLogo from "@/components/SisterlyLogo";
import { CalendarHeart, Baby, Heart, Sparkles, Shield, TrendingUp, ArrowRight, PlayCircle } from "lucide-react";

const features = [
  { icon: CalendarHeart, title: "Menstrual Health", description: "Understand your cycle, record symptoms, and view estimated period dates and cycle phases." },
  { icon: Heart, title: "Fertility Planning", description: "Explore estimated fertile windows and learn how cycle patterns and ovulation signs relate." },
  { icon: Baby, title: "Pregnancy Journey", description: "Follow pregnancy milestones, appointments, and week-by-week educational information." },
  { icon: TrendingUp, title: "Baby Growth", description: "Keep milestones, feeding notes, growth measurements, and vaccination records together." },
  { icon: Sparkles, title: "Personal Insights", description: "Turn the information you choose to record into understandable trends and reflections." },
  { icon: Shield, title: "Privacy First", description: "Private account-based records, clear controls, and secure Firebase-backed storage." },
];

const Landing = () => (
  <div className="min-h-screen bg-background">
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <SisterlyLogo size={38} showWordmark />
          <span className="font-serif font-bold text-lg text-foreground">SISTERLY</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link to="/explore" className="text-sm font-medium text-foreground hover:text-primary px-2 py-2">Explore app</Link>
          <Link to="/auth"><GradientButton variant="ghost" size="sm">Log in</GradientButton></Link>
          <Link to="/auth"><GradientButton variant="cta" size="sm">Sign up</GradientButton></Link>
        </nav>
      </div>
    </header>

    <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/70" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-card">
              <Sparkles className="w-3.5 h-3.5 text-lavender" />
              <span className="text-xs font-medium text-muted-foreground">A trusted sister by your side through every stage of womanhood</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
              Get to know your body. <span className="text-transparent bg-clip-text gradient-accent">Grow with confidence.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Explore menstrual health, fertility, pregnancy and early motherhood in one calm, supportive space.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/explore"><GradientButton variant="cta" size="lg">Explore the app <ArrowRight className="w-4 h-4 ml-2" /></GradientButton></Link>
              <Link to="/auth"><GradientButton variant="outline" size="lg">Create free account</GradientButton></Link>
            </div>
            <p className="text-xs text-muted-foreground">Explore sample screens without signing in. Create an account when you are ready to save your own records.</p>
          </div>
          <div className="flex justify-center items-center min-h-[330px]">
            <WombAnimation />
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[.2em] text-primary font-semibold mb-3">Discover SISTERLY</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">A sister by your side, always</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">A connected experience for understanding your cycle, preparing for pregnancy, and caring for your growing family.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-card rounded-3xl p-6 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-white" /></div>
              <h3 className="font-serif font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 gradient-hero">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Take a look around, at your own pace.</h2>
        <p className="text-muted-foreground mb-7 max-w-xl mx-auto">The Explore area includes sample information so you can understand the experience before sharing any personal details.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/explore"><GradientButton variant="cta" size="lg"><PlayCircle className="w-4 h-4 mr-2" /> Explore without signing in</GradientButton></Link>
          <Link to="/auth"><GradientButton variant="outline" size="lg">Sign up for advanced features</GradientButton></Link>
        </div>
      </div>
    </section>
    <footer className="py-9 border-t border-border">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2"><SisterlyLogo size={28} /><span className="font-serif font-bold">SISTERLY</span></div>
        <p className="text-xs text-muted-foreground text-center">Designed by AI-powered Software & Cybersecurity Engineer — Tongai Godfrey Mapiye © 2026</p>
        <p className="text-[10px] text-muted-foreground text-center max-w-xs">For education and tracking only. Not a substitute for professional medical advice.</p>
      </div>
    </footer>
  </div>
);

export default Landing;
