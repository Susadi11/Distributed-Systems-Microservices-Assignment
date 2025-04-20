import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils.js"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors px-3 py-1 focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",

        // Status-specific variants
        assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        picked: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      size: {
        default: "h-8 px-3 text-sm",
        sm: "h-7 px-2 text-xs",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
