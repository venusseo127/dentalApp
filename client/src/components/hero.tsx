import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section 
      className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20"
      style={{
        backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.8), rgba(2, 132, 199, 0.8)), url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Smile, Our Priority</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Book your dental appointment online with our experienced team. Quality care, convenient scheduling.
          </p>
          <Button 
            onClick={() => window.location.href = "/login"}
            className="bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            size="lg"
          >
            Book Appointment Online
          </Button>
        </div>
      </div>
    </section>
  );
}
