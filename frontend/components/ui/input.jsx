import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ 
  className, 
  type, 
  variant = "default",
  size = "default",
  error,
  ...props 
}, ref) => {
  const baseStyles = "flex w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  
  const variants = {
    default: "border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus-visible:ring-green-400",
    outline: "border-white/30 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-green-400",
    filled: "border-transparent bg-white/5 text-white placeholder:text-gray-400 focus-visible:ring-green-400",
    error: "border-red-500/50 bg-red-500/10 text-white placeholder:text-red-300 focus-visible:ring-red-400"
  }
  
  const sizes = {
    sm: "h-8 px-2 text-xs",
    default: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base",
    xl: "h-14 px-6 text-lg"
  }

  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          error && variants.error,
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  )
})
Input.displayName = "Input"

export { Input } 