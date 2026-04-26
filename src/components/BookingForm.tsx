import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logo from "@/assets/booking-logo.webp";
import { useDomainConfig } from "@/contexts/DomainConfigContext";
import { detectTrafficSource } from "@/lib/trafficSource";

const BookingForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { config } = useDomainConfig();
  const today = new Date();
  const defaultExitDate = new Date(today);
  defaultExitDate.setDate(today.getDate() + 7);

  // Get traffic_source from URL if present
  // Get traffic_source: prefer explicit ?source= param, otherwise auto-detect
  // ("seo" | "Backlink" | "" for paid/direct). Cached in sessionStorage to avoid duplicates.
  const trafficSource = searchParams.get("source") || detectTrafficSource();

  const [entryDate, setEntryDate] = useState<Date>(today);
  const [exitDate, setExitDate] = useState<Date>(defaultExitDate);
  const [entryTime, setEntryTime] = useState("12:30");
  const [exitTime, setExitTime] = useState("12:00");
  const [promoCode, setPromoCode] = useState("");
  const [entryCalendarOpen, setEntryCalendarOpen] = useState(false);
  const [exitCalendarOpen, setExitCalendarOpen] = useState(false);

  // Update exit date when entry date changes (7 days after entry)
  const handleEntryDateChange = (date: Date | undefined) => {
    if (date) {
      setEntryDate(date);
      const newExitDate = new Date(date);
      newExitDate.setDate(date.getDate() + 7);
      setExitDate(newExitDate);
      setEntryCalendarOpen(false);
    }
  };

  const handleExitDateChange = (date: Date | undefined) => {
    if (date) {
      setExitDate(date);
      setExitCalendarOpen(false);
    }
  };

  // Generate time options (00:00 to 23:30 in 30-min intervals)
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      timeOptions.push(timeStr);
    }
  }

  // Convert time to HHMM format for old API compatibility
  const formatTimeForApi = (time: string): string => {
    if (!time) return "1200";
    return time.replace(":", "");
  };

  // Format date as DD/MM/YYYY for API
  const formatDateForApi = (date: Date): string => {
    return format(date, "dd/MM/yyyy");
  };

  const handleSubmit = () => {
    // Use exact field names from old PHP flow
    const params = new URLSearchParams({
      ParkingFrom: formatDateForApi(entryDate),
      CollectingCar: formatDateForApi(exitDate),
      arrival_time: formatTimeForApi(entryTime || "12:00"),
      depart_time: formatTimeForApi(exitTime || "12:00"),
      promoCode: promoCode,
      traffic_source: trafficSource,
    });
    navigate(`/select-parking?${params.toString()}`);
  };

  return (
    <div className="booking-card w-full mx-auto lg:mx-0" style={{ maxWidth: '32rem', border: '5px solid #f8ba12' }}>
      {/* Form Logo */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <img src={logo} alt={config?.title || "Go Airport Parking"} className="h-6 sm:h-8" width={32} height={32} />
        {config?.title && <span className="text-lg sm:text-xl font-bold text-primary">{config.title}</span>}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Entry Date & Time */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            Entry Date
          </label>
          <Popover open={entryCalendarOpen} onOpenChange={setEntryCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-11 sm:h-12 bg-muted/50 border-border hover:bg-muted text-sm sm:text-base",
                  !entryDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                {entryDate ? format(entryDate, "PPP") : "Select entry date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
              <Calendar
                mode="single"
                selected={entryDate}
                onSelect={handleEntryDateChange}
                initialFocus
                disabled={(date) => date < new Date()}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Entry Time */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Clock className="w-4 h-4 text-primary" />
            Entry Time
          </label>
          <Select value={entryTime} onValueChange={setEntryTime}>
            <SelectTrigger
              className="h-11 sm:h-12 bg-muted/50 border-border text-sm sm:text-base"
              aria-label="Entry time"
            >
              <SelectValue placeholder="Select entry time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {timeOptions.map((time) => (
                <SelectItem key={`entry-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Exit Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            Exit Date
          </label>
          <Popover open={exitCalendarOpen} onOpenChange={setExitCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-11 sm:h-12 bg-muted/50 border-border hover:bg-muted text-sm sm:text-base",
                  !exitDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                {exitDate ? format(exitDate, "PPP") : "Select exit date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
              <Calendar
                mode="single"
                selected={exitDate}
                onSelect={handleExitDateChange}
                defaultMonth={exitDate}
                initialFocus
                disabled={(date) => date < (entryDate || new Date())}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Exit Time */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Clock className="w-4 h-4 text-primary" />
            Exit Time
          </label>
          <Select value={exitTime} onValueChange={setExitTime}>
            <SelectTrigger
              className="h-11 sm:h-12 bg-muted/50 border-border text-sm sm:text-base"
              aria-label="Exit time"
            >
              <SelectValue placeholder="Select exit time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {timeOptions.map((time) => (
                <SelectItem key={`exit-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Promo Code */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Tag className="w-4 h-4 text-primary" />
            Promo Code
          </label>
          <Input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="h-11 sm:h-12 bg-muted/50 border-border text-sm sm:text-base"
          />
        </div>

        {/* Terms Notice - Agreement is automatic on submit */}
        <p className="text-xs sm:text-sm text-muted-foreground text-center px-2">
          By clicking Find Parking, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline font-medium">
            terms & conditions
          </a>
          .
        </p>

        {/* Submit Button */}
        <Button
          className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={handleSubmit}
        >
          Find Parking
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;
