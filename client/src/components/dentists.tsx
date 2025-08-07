const dentists = [
  {
    name: "Dr. Sarah Johnson",
    specialization: "General Dentistry",
    experience: "15+ years experience",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    name: "Dr. Michael Chen",
    specialization: "Cosmetic Dentistry",
    experience: "12+ years experience",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
  },
  {
    name: "Dr. Emily Rodriguez",
    specialization: "Orthodontics",
    experience: "10+ years experience",
    image: "https://pixabay.com/get/ge0de4255df96378bc8e5227848dae53b41f53c044f97493b606e8ecba521c59eca18b83d7c31f4537ad941012149e5ac4999e191eb6f65b2be4d5684a60cd1e1_1280.jpg"
  }
];

export default function Dentists() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">Meet Our Dentists</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our experienced team of dental professionals is committed to providing exceptional care.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dentists.map((dentist, index) => (
            <div key={index} className="text-center">
              <img 
                src={dentist.image} 
                alt={dentist.name} 
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-secondary-900">{dentist.name}</h3>
              <p className="text-primary-600 font-medium mb-2">{dentist.specialization}</p>
              <p className="text-gray-600 text-sm">{dentist.experience}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
