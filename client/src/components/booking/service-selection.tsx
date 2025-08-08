import { useQuery } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Service } from "@shared/schema";

interface ServiceSelectionProps {
  selectedServiceId: string;
  onServiceSelect: (serviceId: string) => void;
}

export default function ServiceSelection({ selectedServiceId, onServiceSelect }: ServiceSelectionProps) {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const { serviceService } = await import("@/lib/firestore");
      return await serviceService.getAll();
    },
  });

  if (isLoading) {
    return (
      <div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Select Service</h3>
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
      <h3 className="text-xl font-semibold text-secondary-900 mb-4">Select Service</h3>
      <RadioGroup value={selectedServiceId} onValueChange={onServiceSelect}>
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id}>
              <RadioGroupItem value={service.id} id={service.id} className="sr-only" />
              <Label
                htmlFor={service.id}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="ml-4 flex-1">
                  <div className="font-medium text-secondary-900">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.description}</div>
                  <div className="text-sm font-medium text-primary-600">
                    ${service.price} • {service.duration} minutes
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
