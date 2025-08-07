import { Card, CardContent } from "@/components/ui/card";
import { Smile, User, UserCheck } from "lucide-react";

const services = [
  {
    icon: <UserCheck className="h-8 w-8" />,
    title: "General Dentistry",
    description: "Routine check-ups, cleanings, and preventive care to maintain optimal oral health.",
    price: "Starting from $150"
  },
  {
    icon: <Smile className="h-8 w-8" />,
    title: "Cosmetic Dentistry",
    description: "Teeth whitening, veneers, and smile makeovers to enhance your appearance.",
    price: "Starting from $300"
  },
  {
    icon: <User className="h-8 w-8" />,
    title: "Orthodontics",
    description: "Braces, aligners, and other treatments to straighten teeth and correct bites.",
    price: "Starting from $2,500"
  }
];

export default function Services() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive dental care with modern technology and experienced professionals.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border border-gray-100">
              <CardContent className="p-6">
                <div className="text-primary-500 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-secondary-900">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-primary-600 font-medium">{service.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
