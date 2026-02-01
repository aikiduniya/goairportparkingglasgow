import { Loader2 } from "lucide-react";

type RouteLoadingProps = {
  label?: string;
};

export default function RouteLoading({ label = "Loading…" }: RouteLoadingProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      </div>
    </div>
  );
}
