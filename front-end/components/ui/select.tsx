import * as React from "react"

import { cn } from "@/lib/utils"

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground shadow-sm transition focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = "Select"

const SelectItem = React.forwardRef<HTMLOptionElement, React.ComponentProps<"option">>(
  ({ className, ...props }, ref) => (
    <option ref={ref} className={cn("bg-background text-foreground", className)} {...props} />
  )
)
SelectItem.displayName = "SelectItem"

export { Select, SelectItem }
