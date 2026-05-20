import { useRef, useState, useCallback } from "react";
const TiltCard = ({ children, className = "", glowColor = "0, 72%, 46%", style }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -20;
    const rotateY = (x - 0.5) * 20;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
    setGlowPos({ x: x * 100, y: y * 100 });
  }, []);
  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setIsHovered(false);
  }, []);
  return <div
    ref={cardRef}
    onMouseMove={handleMouseMove}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={handleMouseLeave}
    className={`relative overflow-hidden transition-[box-shadow] duration-300 ${className}`}
    style={{
      transform,
      transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
      boxShadow: isHovered ? `0 0 20px hsla(${glowColor}, 0.12)` : "none",
      ...style
    }}
  >
      {
    /* Spotlight overlay */
  }
      <div
    className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
    style={{
      opacity: isHovered ? 1 : 0,
      background: `radial-gradient(350px circle at ${glowPos.x}% ${glowPos.y}%, hsla(${glowColor}, 0.12), transparent 60%)`
    }}
  />
      {
    /* Shine sweep */
  }
      <div
    className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
    style={{
      opacity: isHovered ? 1 : 0,
      background: `linear-gradient(105deg, transparent 30%, hsla(${glowColor}, 0.06) ${glowPos.x}%, transparent 70%)`
    }}
  />
      {children}
    </div>;
};
var stdin_default = TiltCard;
export {
  stdin_default as default
};
