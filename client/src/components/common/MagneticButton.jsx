import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
const MagneticButton = forwardRef(({ children, className = "", onClick, disabled, ...props }, ref) => {
  const btnRef = useRef(null);
  useImperativeHandle(ref, () => btnRef.current);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const handleMouseMove = useCallback((e) => {
    if (!btnRef.current || disabled) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setOffset({ x, y });
  }, [disabled]);
  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);
  const handleClick = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const ripple = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now()
    };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 700);
    onClick?.(e);
  };
  return <button
    ref={btnRef}
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
    onClick={handleClick}
    disabled={disabled}
    className={`relative overflow-hidden ${className}`}
    style={{
      transform: `translate(${offset.x}px, ${offset.y}px)`,
      transition: "transform 0.2s ease-out"
    }}
    {...props}
  >
      {ripples.map((ripple) => <span
    key={ripple.id}
    className="absolute rounded-full bg-primary-foreground/20 animate-ripple pointer-events-none"
    style={{
      left: ripple.x,
      top: ripple.y,
      transform: "translate(-50%, -50%)"
    }}
  />)}
      {children}
    </button>;
});
var stdin_default = MagneticButton;
export {
  stdin_default as default
};
