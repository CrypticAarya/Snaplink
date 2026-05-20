import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const SIZES = {
  compact: {
    root: "px-3 py-5 sm:py-6",
    card: "rounded-xl",
    iconBox: "mb-3 h-10 w-10 rounded-lg",
    icon: "h-4 w-4",
    title: "text-sm font-semibold",
    description: "mt-1.5 max-w-xs text-xs",
    footer: "mt-4",
  },
  default: {
    root: "px-4 py-7 sm:px-6 sm:py-9",
    card: "rounded-xl sm:rounded-2xl",
    iconBox: "mb-4 h-14 w-14 rounded-xl sm:mb-5 sm:h-16 sm:w-16",
    icon: "h-6 w-6 sm:h-7 sm:w-7",
    title: "text-base font-semibold sm:text-lg",
    description: "mt-2 max-w-md text-sm sm:text-[0.9375rem]",
    footer: "mt-5 sm:mt-6",
  },
};

/**
 * Reusable empty state for dashboards, analytics, and lists.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import("lucide-react").LucideIcon} [props.icon]
 * @param {"compact" | "default"} [props.size]
 * @param {boolean} [props.card] - wrap in surface-card (default size only)
 * @param {string} [props.ctaLabel] - primary CTA label
 * @param {() => void} [props.ctaOnClick]
 * @param {"default" | "outline" | "secondary" | "ghost"} [props.ctaVariant]
 * @param {import("lucide-react").LucideIcon} [props.ctaIcon]
 * @param {boolean} [props.ctaDisabled]
 * @param {React.ReactNode} [props.action] - custom CTA slot (e.g. dialog trigger)
 * @param {string} [props.className]
 */
export function EmptyState({
  title,
  description,
  icon: Icon,
  size = "default",
  card = true,
  className,
  ctaLabel,
  ctaOnClick,
  ctaVariant = "outline",
  ctaIcon: CtaIcon,
  ctaDisabled = false,
  action,
}) {
  const styles = SIZES[size] ?? SIZES.default;
  const compact = size === "compact";

  const cta =
    action ??
    (ctaLabel && ctaOnClick ? (
      <Button
        type="button"
        variant={ctaVariant}
        size="sm"
        className="rounded-lg gap-2"
        onClick={ctaOnClick}
        disabled={ctaDisabled}
      >
        {CtaIcon ? <CtaIcon className="h-4 w-4 shrink-0" aria-hidden /> : null}
        {ctaLabel}
      </Button>
    ) : null);

  const content = (
    <div
      className={cn(
        "flex w-full flex-col items-center text-center",
        styles.root,
        className
      )}
      role="status"
      aria-label={title}
    >
      {Icon ? (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center border border-border/60 bg-gradient-to-b from-muted/35 to-muted/5",
            styles.iconBox
          )}
          aria-hidden
        >
          <Icon className={cn("text-primary", styles.icon)} strokeWidth={1.75} />
        </div>
      ) : null}

      <h3 className={cn("tracking-tight text-foreground", styles.title)}>
        {title}
      </h3>

      {description ? (
        <p
          className={cn(
            "mx-auto leading-relaxed text-muted-foreground",
            styles.description
          )}
        >
          {description}
        </p>
      ) : null}

      {cta ? (
        <div
          className={cn(
            "flex w-full flex-wrap items-center justify-center gap-2",
            styles.footer
          )}
        >
          {cta}
        </div>
      ) : null}
    </div>
  );

  if (compact) {
    return content;
  }

  if (card) {
    return (
      <div className={cn("surface-card w-full", styles.card)}>{content}</div>
    );
  }

  return <div className="w-full">{content}</div>;
}

export default EmptyState;
