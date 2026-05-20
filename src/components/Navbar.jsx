import { Link } from "lucide-react";
import GlitchText from "./GlitchText";
import MagneticButton from "./MagneticButton";
const Navbar = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center group-hover:shadow-accent group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out">
            <Link className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
            <GlitchText text="SnapLink" />
          </span>
        </div>
        <MagneticButton
    className="px-5 py-2 rounded-xl border border-border/80 text-sm font-medium text-foreground hover:bg-white/[0.04] hover:border-primary/35 hover:text-primary hover:shadow-accent transition-all duration-300 ease-out"
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
