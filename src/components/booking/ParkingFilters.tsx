import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ParkingFiltersProps {
  activeFilter: "all" | "meet-greet" | "park-ride";
  setActiveFilter: (filter: "all" | "meet-greet" | "park-ride") => void;
  sortBy: "low-to-high" | "high-to-low";
  setSortBy: (sort: "low-to-high" | "high-to-low") => void;
}

const ParkingFilters = ({
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
}: ParkingFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
          className={activeFilter === "all" ? "bg-primary text-primary-foreground" : ""}
        >
          All
        </Button>
        <Button
          variant={activeFilter === "meet-greet" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("meet-greet")}
          className={activeFilter === "meet-greet" ? "bg-primary text-primary-foreground" : ""}
        >
          Meet & Greet
        </Button>
        <Button
          variant={activeFilter === "park-ride" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("park-ride")}
          className={activeFilter === "park-ride" ? "bg-primary text-primary-foreground" : ""}
        >
          Park & Ride
        </Button>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort:</span>
        <Select value={sortBy} onValueChange={(value: "low-to-high" | "high-to-low") => setSortBy(value)}>
          <SelectTrigger className="w-32 h-9 bg-background" aria-label="Sort options">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="low-to-high">Low to High</SelectItem>
            <SelectItem value="high-to-low">High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ParkingFilters;
