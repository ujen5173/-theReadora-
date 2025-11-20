import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const DateRange = ({
  onUpdate,
  initialDateFrom,
  initialDateTo,
  align,
}: {
  onUpdate: (value: string) => void;
  initialDateFrom: "string";
  initialDateTo: "string";
  align: "string" | "end" | "center";
}) => {
  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {initialDate && endDate
              ? `${initialDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
              : "Select Date Range"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={initialDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              setInitialDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRange;
