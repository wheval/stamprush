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
  const baseStyles = "flex w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
  
  const variants = {
    default: "border-[#FF6F00]/20 bg-white text-gray-800 placeholder-gray-400 focus-visible:ring-[#FF6F00] focus-visible:border-[#FF6F00]/60",
    outline: "border-[#FF6F00]/30 bg-transparent text-gray-800 placeholder-gray-400 focus-visible:ring-[#FF6F00] focus-visible:border-[#FF6F00]/60",
    filled: "border-transparent bg-[#9C27B0]/5 text-gray-800 placeholder-gray-500 focus-visible:ring-[#9C27B0] focus-visible:border-[#9C27B0]/60",
    error: "border-red-500/50 bg-red-50 text-gray-800 placeholder-red-400 focus-visible:ring-red-400"
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
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
})
Input.displayName = "Input"

export { Input } 