import { useQuery } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DentistSelectionProps {
  selectedDentistId: string;
  onDentistSelect: (dentistId: string) => void;
}

export default function DentistSelection({ selectedDentistId, onDentistSelect }: DentistSelectionProps) {
  const { data: dentists = [], isLoading } = useQuery({
    queryKey: ["/api/dentists"],
  });

  if (isLoading) {
    return (
      <div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Select Dentist</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-secondary-900 mb-4">Select Dentist</h3>
      <RadioGroup value={selectedDentistId} onValueChange={onDentistSelect}>
        <div className="space-y-3">
          {dentists.map((dentist: any) => (
            <div key={dentist.id}>
              <RadioGroupItem value={dentist.id} id={dentist.id} className="sr-only" />
              <Label
                htmlFor={dentist.id}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <img
                  src={dentist.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face"}
                  alt={dentist.name}
                  className="ml-4 w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4 flex-1">
                  <div className="font-medium text-secondary-900">{dentist.name}</div>
                  <div className="text-sm text-gray-600">{dentist.specialization}</div>
                  <div className="text-sm text-primary-600">{dentist.experience}</div>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
