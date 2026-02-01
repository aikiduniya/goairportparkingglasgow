import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format, parse } from "date-fns";
import { Calendar, Clock, Tag, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatesSummaryProps {
  entryDate: string;
  entryTime: string;
  exitDate: string;
  exitTime: string;
  promoCode: string;
}

// Helper to parse DD/MM/YYYY string to Date
const parseDateString = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  try {
    // Try parsing DD/MM/YYYY format first
    const parsed = parse(dateStr, "dd/MM/yyyy", new Date());
    if (!isNaN(parsed.getTime())) return parsed;
    // Fallback to ISO format
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) return isoDate;
    return undefined;
  } catch {
    return undefined;
  }
};

// Helper to convert HHMM to HH:MM format
const formatTimeForDisplay = (time: string): string => {
  if (!time) return "12:00";
  if (time.includes(":")) return time;
  if (time.length === 4) {
    return `${time.slice(0, 2)}:${time.slice(2)}`;
  }
  return "12:00";
};

const DatesSummary = ({
  entryDate: initialEntryDate,
  entryTime: initialEntryTime,
  exitDate: initialExitDate,
  exitTime: initialExitTime,
  promoCode: initialPromoCode,
}: DatesSummaryProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [entryDate, setEntryDate] = useState<Date | undefined>(
    parseDateString(initialEntryDate)
  );
  const [exitDate, setExitDate] = useState<Date | undefined>(
    parseDateString(initialExitDate)
  );
  const [entryTime, setEntryTime] = useState(formatTimeForDisplay(initialEntryTime));
  const [exitTime, setExitTime] = useState(formatTimeForDisplay(initialExitTime));
  const [promoCode, setPromoCode] = useState(initialPromoCode);

  const [entryCalendarOpen, setEntryCalendarOpen] = useState(false);
  const [exitCalendarOpen, setExitCalendarOpen] = useState(false);

  // Generate time options
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      timeOptions.push(timeStr);
    }
  }

  const handleUpdate = () => {
    // Format time as HHMM for API
    const formatTimeForApi = (time: string): string => {
      if (!time) return "1200";
      return time.replace(":", "");
    };
    
    const params = new URLSearchParams({
      ParkingFrom: entryDate ? format(entryDate, "dd/MM/yyyy") : "",
      CollectingCar: exitDate ? format(exitDate, "dd/MM/yyyy") : "",
      arrival_time: formatTimeForApi(entryTime || "12:00"),
      depart_time: formatTimeForApi(exitTime || "12:00"),
      promoCode: promoCode,
    });
    navigate(`/select-parking?${params.toString()}`);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not set";
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg sticky top-20 sm:top-24">
      <h2 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4">Your Dates</h2>

      <div className="space-y-3 sm:space-y-4">
        {/* Entry Date */}
        <div>
          <Popover open={entryCalendarOpen} onOpenChange={setEntryCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10 sm:h-12 bg-muted/50 border-border hover:bg-muted text-sm",
                  !entryDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-semibold truncate">{formatDate(entryDate)}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">Entry date</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
              <CalendarComponent
                mode="single"
                selected={entryDate}
                onSelect={(date) => {
                  setEntryDate(date);
                  setEntryCalendarOpen(false);
                }}
                defaultMonth={entryDate}
                initialFocus
                disabled={(date) => date < new Date()}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <div className="mt-2">
            <Select value={entryTime} onValueChange={setEntryTime}>
              <SelectTrigger className="h-9 sm:h-10 bg-muted/50 border-border text-sm">
                <SelectValue placeholder="Select time" />
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
        </div>

        {/* Exit Date */}
        <div>
          <Popover open={exitCalendarOpen} onOpenChange={setExitCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10 sm:h-12 bg-muted/50 border-border hover:bg-muted text-sm",
                  !exitDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="font-semibold truncate">{formatDate(exitDate)}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">Exit date</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
              <CalendarComponent
                mode="single"
                selected={exitDate}
                onSelect={(date) => {
                  setExitDate(date);
                  setExitCalendarOpen(false);
                }}
                defaultMonth={exitDate}
                initialFocus
                disabled={(date) => date < (entryDate || new Date())}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <div className="mt-2">
            <Select value={exitTime} onValueChange={setExitTime}>
              <SelectTrigger className="h-9 sm:h-10 bg-muted/50 border-border text-sm">
                <SelectValue placeholder="Select time" />
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
        </div>

        {/* Promo Code */}
        <div className="pt-3 sm:pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Promo</span>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="h-9 sm:h-10 text-sm"
            />
          </div>
        </div>

        {/* Update Button */}
        <Button
          onClick={handleUpdate}
          variant="outline"
          className="w-full h-9 sm:h-10 text-sm"
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default DatesSummary;
