import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface DateTimeSelectionProps {
  selectedDate: string;
  selectedTime: string;
  dentistId: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
}

// Sample time slots - in a real app, this would come from the availability API
const timeSlots = [
  "09:00", "10:30", "14:00", "15:30", "16:30"
];

export default function DateTimeSelection({
  selectedDate,
  selectedTime,
  dentistId,
  onDateSelect,
  onTimeSelect
}: DateTimeSelectionProps) {
  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onDateSelect(newDate.toISOString().split('T')[0]);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Select Date</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
            className="rounded-md"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Available Times</h3>
        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              className={`p-3 text-center transition-colors ${
                selectedTime === time 
                  ? "bg-primary-500 hover:bg-primary-600" 
                  : "hover:bg-primary-50 hover:border-primary-200"
              }`}
              onClick={() => onTimeSelect(time)}
            >
              <div>
                <div className="font-medium">{formatTime(time)}</div>
                <div className="text-xs opacity-75">Available</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
