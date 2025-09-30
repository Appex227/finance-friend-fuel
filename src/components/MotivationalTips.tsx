import { Card } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Target, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const tips = [
  {
    icon: Lightbulb,
    text: "Track every dollar! Small expenses add up quickly over time.",
    color: "text-primary"
  },
  {
    icon: Target,
    text: "Set specific savings goals. They're easier to achieve when you can visualize them.",
    color: "text-success"
  },
  {
    icon: TrendingUp,
    text: "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
    color: "text-primary"
  },
  {
    icon: Sparkles,
    text: "Before buying, wait 24 hours. You might realize you don't need it!",
    color: "text-accent-foreground"
  },
  {
    icon: Target,
    text: "Automate your savings! Set up automatic transfers to your savings account.",
    color: "text-success"
  },
  {
    icon: Lightbulb,
    text: "Cut one subscription you rarely use. That's instant savings!",
    color: "text-primary"
  },
  {
    icon: TrendingUp,
    text: "Cook at home more often. Restaurant meals cost 3-5x more than home cooking.",
    color: "text-primary"
  },
  {
    icon: Sparkles,
    text: "Use the envelope method for discretionary spending to stay on track.",
    color: "text-accent-foreground"
  }
];

export function MotivationalTips() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const tip = tips[currentTip];
  const Icon = tip.icon;

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/5 border-primary/20">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-card shadow-sm">
          <Icon className={`h-6 w-6 ${tip.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            💡 Money Saving Tip
          </h3>
          <p className="text-foreground font-medium leading-relaxed">
            {tip.text}
          </p>
        </div>
      </div>
      <div className="flex gap-1 mt-4">
        {tips.map((_, index) => (
          <div 
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${
              index === currentTip ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </Card>
  );
}
