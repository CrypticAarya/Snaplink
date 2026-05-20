export function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="surface-card h-full p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
            {label}
          </p>
          <p className="mt-1 truncate text-xl font-bold tabular-nums tracking-tight text-foreground sm:mt-1.5 sm:text-2xl">
            {value}
          </p>
          {hint && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:text-xs">
              {hint}
            </p>
          )}
        </div>
        {Icon && (
          <div className="shrink-0 rounded-lg bg-primary/10 p-1.5 text-primary sm:p-2">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        )}
      </div>
    </div>
  );
}
