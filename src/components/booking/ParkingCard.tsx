import { MapPin, Clock, Info, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ParkingOption } from "@/types/booking";
import { useDomainConfig } from "@/contexts/DomainConfigContext";

interface ParkingCardProps {
  option: ParkingOption;
  onBookNow: () => void;
}

const ParkingCard = ({ option, onBookNow }: ParkingCardProps) => {
  const { config } = useDomainConfig();
  const airportCode = config?.airport_code || "GLA";
  const isParkRide = option.type === "park-ride";

  // Different header colors based on service type and name
  const getHeaderStyle = () => {
    if (option.name.includes("GUMTREE")) {
      return "bg-gradient-to-br from-orange-500 to-orange-600";
    }
    if (option.type === "meet-greet") {
      return "bg-gradient-to-br from-purple-600 to-purple-700";
    }
    return "bg-gradient-to-br from-primary to-primary/90";
  };

  return (
    <div className="bg-background border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Header/Image Section */}
      <div className={`relative h-36 ${getHeaderStyle()} flex items-center justify-center p-4`}>
        <Button
          variant="outline"
          size="sm"
          className="absolute top-3 right-3 h-7 px-2 bg-white/90 hover:bg-white text-primary border-0 text-xs font-medium"
        >
          <Info className="w-3 h-3 mr-1" />
          More Info & Map
        </Button>

        {/* Logo/Branding */}
        <div className="text-center text-white">
          {option.name.includes("GUMTREE") && <p className="text-xs font-bold mb-1 tracking-wider">GUMTREE</p>}
          {option.type === "meet-greet" && option.name.includes("Covered") && (
            <div className="mb-2">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded">MEET & GREET</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-black tracking-tight">GO</span>
            <span className="text-2xl font-bold">{airportCode}</span>
          </div>
          <p className="text-sm font-bold mt-1 tracking-wide">
            {isParkRide ? "PARK & FLY" : option.name.includes("Covered") ? "AIRPORT COVERED" : "AIRPORT"}
          </p>
          {!isParkRide && !option.name.includes("Covered") && (
            <div className="flex justify-center gap-1 mt-1">
              <span className="text-yellow-400">✈</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title */}
        <h3 className="text-sm md:text-base font-bold text-foreground mb-3 leading-tight">{option.name}</h3>

        {/* Price & Type Row */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-primary">€{option.price.toFixed(2)}</p>
          <span className="text-xs text-muted-foreground">{isParkRide ? "Shuttle Included" : "At Terminal"}</span>
        </div>

        {/* Features List */}
        <div className="mb-4 flex-1">
          {isParkRide ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Bus className="w-3.5 h-3.5 text-primary" />
                <span>Park and Ride</span>
              </div>
              {option.distance && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{option.distance}</span>
                </div>
              )}
              {option.transferTime && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{option.transferTime}</span>
                </div>
              )}
            </div>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
              <li>Meet and Greet</li>
              <li>Valet Parking</li>
              <li>Arrive At The Terminal</li>
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <p className="text-sm font-bold text-foreground">€{option.price.toFixed(2)} To Pay</p>
          <Button
            onClick={onBookNow}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 h-9 text-sm"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParkingCard;
