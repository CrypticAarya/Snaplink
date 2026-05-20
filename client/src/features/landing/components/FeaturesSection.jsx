import { Zap, BarChart3, Link2 } from "lucide-react";
import TiltCard from "@/components/common/TiltCard";
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
  return <section className="relative z-10 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="mb-2 text-xl font-bold text-foreground sm:mb-3 sm:text-3xl">Why choose SnapLink?</h2>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground sm:text-base">
            Everything you need to manage, track, and optimize your links.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {features.map((feature, i) => <TiltCard
    key={feature.title}
    className="surface-card rounded-xl"
  >
              <div className="relative z-20 p-6 sm:p-7 text-center">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
