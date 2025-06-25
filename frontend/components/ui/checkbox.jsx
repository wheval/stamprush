import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  const handleChange = (e) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        ref={ref}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
      <div
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          checked && "bg-primary text-primary-foreground",
          className
        )}
        onClick={() => onCheckedChange && onCheckedChange(!checked)}
      >
        {checked && (
          <Check className="h-3 w-3 text-white" />
        )}
      </div>
    </div>
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox }; 