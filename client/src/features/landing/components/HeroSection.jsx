import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
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

  return (
    <span>
      {texts[textIndex].substring(0, charIndex)}
      <span className="animate-blink text-primary">|</span>
    </span>
  );
};

const HeroSection = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (url.trim()) {
      navigate(`/auth?createNew=${encodeURIComponent(url.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 sm:mb-7">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            Lightning-fast URL shortening
          </span>
        </div>

        <h1 className="mb-4 text-[1.75rem] font-extrabold leading-[1.12] tracking-tight sm:mb-5 sm:text-5xl md:text-6xl">
          <span className="gradient-text-hero block break-words">
            <GlitchText text="Simplify your links." />
          </span>
          <span className="gradient-text-hero mt-1 block break-words sm:mt-1.5">
            <GlitchText text="Amplify your reach." />
          </span>
        </h1>

        <div className="hero-subtitle mx-auto mb-8 min-h-[3rem] max-w-xl px-1 sm:mb-10 sm:min-h-[3.5rem]">
          <TypeWriter
            texts={[
              "Transform long URLs into clean, memorable short links.",
              "Track clicks, analyze traffic, and grow your brand.",
              "Customize links to match your brand identity.",
              "Share smarter. Reach further. Grow faster.",
            ]}
          />
        </div>

        <div className="mx-auto max-w-xl px-1 py-2 sm:py-3">
          <form
            onSubmit={handleShorten}
            className="input-glow flex flex-col gap-2.5 rounded-xl border border-border/80 bg-card/60 p-2 backdrop-blur-sm transition-colors sm:flex-row sm:gap-3 sm:p-2.5"
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long link here…"
              className="min-h-11 min-w-0 flex-1 rounded-lg bg-transparent px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground sm:px-5"
              onKeyDown={(e) => e.key === "Enter" && handleShorten(e)}
            />
            <MagneticButton
              type="submit"
              className="gradient-primary min-h-11 shrink-0 whitespace-nowrap rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground transition-[filter,transform] hover:brightness-105 active:scale-[0.98] sm:px-8 sm:text-base"
            >
              Shorten Link
            </MagneticButton>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
