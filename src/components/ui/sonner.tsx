import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = React.forwardRef<React.ElementRef<typeof Sonner>, ToasterProps>(
  ({ ...props }, ref) => {
    const { theme = "system" } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Defer mounting to avoid forced reflow during initial render
    // Double requestAnimationFrame ensures we're past the initial paint
    React.useEffect(() => {
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMounted(true);
        });
      });
      return () => cancelAnimationFrame(rafId);
    }, []);

    if (!mounted) {
      return null;
    }

    return (
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
        {...props}
      />
    );
  }
);
Toaster.displayName = "Toaster";

export { Toaster, toast };
