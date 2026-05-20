import { Zap, BarChart3, Link2 } from "lucide-react";
import TiltCard from "./TiltCard";
const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Shorten your long, bulky URLs into memorable links in less than a second."
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Track every click. Know where your audience comes from and which devices they use."
  },
  {
    icon: Link2,
    title: "Custom Links",
    description: "Personalize your links to match your brand and build trust with your audience."
  }
];
const FeaturesSection = () => {
  return <section className="py-24 relative z-10">
      <div className="w-full px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Why choose SnapLink?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to manage, track, and optimize your links.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => <TiltCard
    key={feature.title}
    className="glow-card rounded-2xl animate-fade-in-up"
    style={{ animationDelay: `${i * 0.15}s` }}
  >
              <div className="relative z-20 p-8 text-center group">
                <div className="w-14 h-14 rounded-2xl bg-primary/12 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/22 group-hover:scale-110 group-hover:shadow-accent group-hover:rotate-[5deg] transition-all duration-500 ease-out">
                  <feature.icon className="w-6 h-6 text-primary group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_hsl(var(--primary)/0.45)] transition-all duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </TiltCard>)}
        </div>
      </div>
    </section>;
};
var stdin_default = FeaturesSection;
export {
  stdin_default as default
};
