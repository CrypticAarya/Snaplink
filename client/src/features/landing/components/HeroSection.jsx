import { useState, useEffect, useRef } from "react";
import { Zap, Copy, ExternalLink } from "lucide-react";
import MagneticButton from "@/components/common/MagneticButton";
import GlitchText from "@/components/common/GlitchText";
import { useNavigate } from "react-router-dom";
const TypeWriter = ({ texts }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting && charIndex < current.length) {
          setCharIndex((c) => c + 1);
        } else if (!isDeleting && charIndex === current.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        } else if (isDeleting && charIndex > 0) {
          setCharIndex((c) => c - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % texts.length);
        }
      },
      isDeleting ? 30 : 60
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);
  return <span>
      {texts[textIndex].substring(0, charIndex)}
      <span className="animate-blink text-primary">|</span>
    </span>;
};
const HeroSection = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  useEffect(() => {
    const handleMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width * 100,
        y: (e.clientY - rect.top) / rect.height * 100
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);
  const navigate = useNavigate();
  
  const handleShorten = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (url) {
      navigate(`/auth?createNew=${url}`);
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
      {
    /* Interactive mouse-following glow */
  }
      <div
    className="pointer-events-none absolute w-[700px] h-[700px] rounded-full opacity-[0.07] blur-[130px] transition-all duration-500 ease-out"
    style={{
      background: "hsl(262 83% 58%)",
      left: `${mousePos.x}%`,
      top: `${mousePos.y}%`,
      transform: "translate(-50%, -50%)"
    }}
  />

      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      {
    /* Floating animated orbs */
  }
      <div className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-primary/5 blur-[100px] animate-float" />
      <div className="absolute bottom-10 right-[15%] w-96 h-96 rounded-full bg-primary/4 blur-[120px] animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-[40%] right-[5%] w-48 h-48 rounded-full bg-primary/3 blur-[80px] animate-orbit" />
      <div className="absolute top-[60%] left-[5%] w-32 h-32 rounded-full bg-primary/4 blur-[60px] animate-orbit" style={{ animationDelay: "5s" }} />

      <div className="w-full relative px-6 text-center z-10">
        {
    /* Animated badge */
  }
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/10 mb-8 animate-fade-in hover:border-primary/45 hover:bg-primary/[0.14] hover:shadow-[0_0_24px_hsl(var(--primary)/0.18)] transition-all duration-300 ease-out cursor-default group">
          <Zap className="w-3.5 h-3.5 text-primary animate-pulse-glow" />
          <span className="text-xs font-medium text-primary">Lightning-fast URL shortening</span>
        </div>

        {
    /* Headline with glitch effect */
  }
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
          <span className="inline-block animate-fade-in-up gradient-text-hero">
            <GlitchText text="Simplify your links." />
          </span>
          <br />
          <span className="inline-block animate-fade-in-up gradient-text-hero" style={{ animationDelay: "0.12s" }}>
            <GlitchText text="Amplify your reach." />
          </span>
        </h1>

        {
    /* Typewriter subtitle */
  }
        <div className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in-up h-16" style={{ animationDelay: "0.24s" }}>
          <TypeWriter
    texts={[
      "Transform long URLs into clean, memorable short links.",
      "Track clicks, analyze traffic, and grow your brand.",
      "Customize links to match your brand identity.",
      "Share smarter. Reach further. Grow faster."
    ]}
  />
        </div>

        {
    /* Input with animated neon border */
  }
        <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.36s" }}>
          <div className="relative group/input">
            {
    /* Animated rotating border */
  }
            <div
    className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-700 animate-spin-slow"
    style={{
      background: "conic-gradient(from 0deg, transparent, hsl(262 83% 58% / 0.35), transparent, hsl(280 72% 52% / 0.35), transparent)"
    }}
  />
            <div className="relative flex flex-col sm:flex-row gap-3 p-2 rounded-2xl border border-border/70 bg-card/50 backdrop-blur-md input-glow transition-all duration-300 ease-out">
              <input
    type="url"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    placeholder="Paste your long link here..."
    className="flex-1 bg-transparent px-5 py-3.5 text-foreground placeholder:text-muted-foreground outline-none text-base"
    onKeyDown={(e) => e.key === "Enter" && handleShorten()}
  />
              <MagneticButton
    onClick={handleShorten}
    disabled={isLoading}
    className="gradient-primary px-8 py-3.5 rounded-xl text-primary-foreground font-semibold text-base transition-all duration-300 ease-out disabled:opacity-60 whitespace-nowrap shadow-md shadow-primary/25 hover:shadow-accent-lg hover:brightness-[1.03] active:scale-[0.98]"
  >
                {isLoading ? <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Shortening...
                  </span> : "Shorten Link"}
              </MagneticButton>
            </div>
          </div>

          {
    /* Result */
  }
          {shortenedUrl && <div className="mt-4 flex items-center justify-between gap-3 p-4 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-md animate-slide-in-up ring-1 ring-white/[0.04]">
              <div className="flex items-center gap-3 min-w-0">
                <ExternalLink className="w-4 h-4 text-primary shrink-0 animate-bounce-subtle" />
                <span className="text-primary font-medium truncate">{shortenedUrl}</span>
              </div>
              <MagneticButton
    onClick={handleCopy}
    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/15 text-primary text-sm font-medium hover:bg-primary/25 hover:shadow-accent transition-all duration-200 ease-out shrink-0"
  >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied!" : "Copy"}
              </MagneticButton>
            </div>}
        </div>


      </div>
    </section>;
};
var stdin_default = HeroSection;
export {
  stdin_default as default
};
