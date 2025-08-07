import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Dentists from "@/components/dentists";

export default function Landing() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navigation />
      <Hero />
      <Services />
      <Dentists />
    </div>
  );
}
