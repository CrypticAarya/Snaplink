import * as React from "react"

import { cn } from "@/utils/cn"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-11 min-h-[44px] w-full min-w-0 rounded-xl border border-border/80 bg-muted/30 px-3 py-2 text-base sm:text-sm ring-offset-background transition-[border-color,box-shadow,background-color] duration-200 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary/45 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
