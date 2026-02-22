import { Car } from "lucide-react";

type RouteLoadingProps = {
  label?: string;
};

export default function RouteLoading({ label = "Loading…" }: RouteLoadingProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        {/* Road animation */}
        <div className="relative w-64 h-16 overflow-hidden">
          {/* Road */}
          <div className="absolute bottom-2 w-full h-2 bg-muted-foreground/30 rounded-full" />
          {/* Dashed center line */}
          <div className="absolute bottom-[11px] w-full h-[2px] flex gap-3 animate-[roadSlide_1s_linear_infinite]">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="block w-4 h-[2px] bg-accent shrink-0" />
            ))}
          </div>
          {/* Car moving */}
          <div className="absolute bottom-3 animate-[carBounce_1s_ease-in-out_infinite]" style={{ left: "45%" }}>
            <Car className="w-10 h-10 text-primary" />
          </div>
        </div>
        <span className="text-sm font-medium text-muted-foreground animate-pulse">{label}</span>

        <style>{`
          @keyframes carBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          @keyframes roadSlide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-28px); }
          }
        `}</style>
      </div>
    </div>
  );
}
