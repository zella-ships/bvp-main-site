import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ============================================
// BVP SECTION COMPONENT
// Consistent spacing and container widths
// ============================================

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Background color variant */
  variant?: "white" | "gray" | "black" | "gold" | "navy";
  /** Padding size */
  padding?: "none" | "sm" | "md" | "lg";
  /** Whether to include the container */
  container?: boolean;
  /** HTML element to render as */
  as?: "section" | "div" | "article" | "aside";
  children: React.ReactNode;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      variant = "white",
      padding = "lg",
      container = true,
      as: Component = "section",
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      white: "bg-white text-black",
      gray: "bg-gray-100 text-black",
      black: "bg-black text-white",
      gold: "bg-bvp-gold text-black",
      navy: "bg-bvp-navy text-white",
    };

    // Fluid padding values using clamp()
    const paddingStyles = {
      none: {},
      sm: { padding: 'clamp(3rem, 6vw, 4rem) clamp(1rem, 4vw, 5.75rem)' },
      md: { padding: 'clamp(4rem, 8vw, 5rem) clamp(1rem, 4vw, 5.75rem)' },
      lg: { padding: 'clamp(5rem, 10vw, 8rem) clamp(1rem, 4vw, 5.75rem)' },
    };

    return (
      <Component
        // @ts-ignore - ref typing issue with dynamic component
        ref={ref}
        className={cn(variants[variant], className)}
        style={paddingStyles[padding]}
        {...props}
      >
        {container ? (
          <div className="max-w-container mx-auto">{children}</div>
        ) : (
          children
        )}
      </Component>
    );
  }
);

Section.displayName = "Section";

// Section Header - for consistent section titles
export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, label, title, description, centered = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(centered && "text-center", className)}
      style={{ marginBottom: 'clamp(2rem, 5vw, 4rem)' }}
      {...props}
    >
      {label && (
        <p className="font-bold uppercase tracking-widest mb-4 text-gray-500" style={{ fontSize: 'clamp(0.625rem, 0.5rem + 0.5vw, 0.75rem)' }}>
          {label}
        </p>
      )}
      <h2 className="font-bold text-balance" style={{ fontSize: 'clamp(1.5rem, 1rem + 2.5vw, 2.5rem)' }}>
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-gray-600 max-w-3xl leading-relaxed",
            centered && "mx-auto"
          )}
          style={{ marginTop: 'clamp(1rem, 2vw, 1.5rem)', fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)' }}
        >
          {description}
        </p>
      )}
    </div>
  )
);

SectionHeader.displayName = "SectionHeader";

export { Section, SectionHeader };
