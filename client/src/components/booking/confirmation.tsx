import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Service, Dentist } from "@shared/schema";

interface BookingData {
  serviceId: string;
  dentistId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

interface ConfirmationProps {
  bookingData: BookingData;
  onNotesChange: (notes: string) => void;
}

export default function Confirmation({ bookingData, onNotesChange }: ConfirmationProps) {
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: dentists = [] } = useQuery<Dentist[]>({
    queryKey: ["/api/dentists"],
  });

  const selectedService = services.find((s) => s.id === bookingData.serviceId);
  const selectedDentist = dentists.find((d) => d.id === bookingData.dentistId);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-secondary-900 mb-6 text-center">
        Confirm Your Appointment
      </h3>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dentist:</span>
            <span className="font-medium">{selectedDentist?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(bookingData.appointmentDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{formatTime(bookingData.appointmentTime)}</span>
          </div>
          <div className="flex justify-between border-t pt-4">
            <span className="text-gray-600">Total Cost:</span>
            <span className="font-semibold text-lg">${selectedService?.price}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="notes" className="text-sm font-medium text-secondary-900 mb-2 block">
            Additional Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Any specific concerns or requests..."
            value={bookingData.notes || ""}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
