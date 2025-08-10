import { useQuery } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Dentist } from "@shared/schema";

interface DentistSelectionProps {
  selectedDentistId: string;
  onDentistSelect: (dentist: Dentist) => void; // send full object now
}

export default function DentistSelection({ selectedDentistId, onDentistSelect }: DentistSelectionProps) {
  const { data: dentists = [], isLoading } = useQuery<Dentist[]>({
    queryKey: ["dentists"],
    queryFn: async () => {
      const { getDentists } = await import("@/lib/firestore");
      return await getDentists();
    },
  });
  // Seed dentists
  var dentistList: Omit<Dentist, 'createdAt'>[] = [
    {
      id: "1",
      name: 'Dr. Sarah Johnson',
      specialization: 'General Dentistry',
      email: 'sarah.johnson@smilecare.com',
      phone: '(555) 123-4567',
      experience: "15 yrs",
      rating: 5,
      reviewCount: 127,
      isAvailable: true,
      isActive:true,
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: 'Dr. Michael Chen',
      specialization: 'Orthodontics',
      email: 'michael.chen@smilecare.com',
      phone: '(555) 123-4568',
      experience: "12 years",
      rating: 5,
      reviewCount: 98,
      isAvailable: true,
      isActive:true,
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: 'Dr. Emily Rodriguez',
      specialization: 'Oral Surgery',
      email: 'emily.rodriguez@smilecare.com',
      phone: '(555) 123-4569',
      experience: "10 years",
      rating: 4,
      reviewCount: 76,
      isAvailable: true,
      isActive:true,
      updatedAt: new Date(),
    },
  ];
  
  if (isLoading) {
    return (
      <div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Select Dentist</h3>
        <div className="space-y-3">
          <RadioGroup value={selectedDentistId} onValueChange={(id) => {
              const selected = dentists.find((d) => d.id === id);
              if (selected) {
                onDentistSelect(selected); // ✅ send full dentist object
              }
            }}>
            <div className="space-y-3">
              {dentistList.map((dentist) => (
                <div key={dentist.id}>
                  <RadioGroupItem value={dentist.id} id={dentist.name} className="sr-only" />
                  <Label
                    htmlFor={dentist.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <img
                      src={dentist.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face"}
                      alt={dentist.id}
                      className="ml-4 w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <div className={` ${
                          selectedDentistId == dentist.id 
                            ? "text-xl text-accent-primary-200" 
                            : "font-medium text-secondary-900"
                        }`}>{dentist.name}</div>
                      <div className="text-sm text-gray-600">{dentist.specialization} - {selectedDentistId}</div>
                      <div className="text-sm text-primary-600">{dentist.experience} {dentist.id}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-secondary-900 mb-4">Select Dentist</h3>
      <RadioGroup value={selectedDentistId} onValueChange={(id) => {
              const selected = dentists.find((d) => d.id === id);
              if (selected) {
                onDentistSelect(selected); // ✅ send full dentist object
              }
            }}>
        <div className="space-y-3">
          {dentists.map((dentist) => (
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
                  <div className={` ${
                          selectedDentistId == dentist.id 
                            ? "text-xl text-accent-primary-200" 
                            : "font-medium text-secondary-900"
                        }`}>{dentist.name}</div>
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
