import { Link } from "lucide-react";
import GlitchText from "./GlitchText";
import MagneticButton from "./MagneticButton";
const Navbar = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center group-hover:shadow-[0_0_25px_hsl(135_100%_42%/0.4)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <Link className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
            <GlitchText text="SHORTIFY" />
          </span>
        </div>
        <MagneticButton
    className="px-5 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_20px_hsl(135_100%_42%/0.2)] transition-all duration-300"
  >
          Login
        </MagneticButton>
      </div>
    </nav>;
};
var stdin_default = Navbar;
export {
  stdin_default as default
};
