import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, MapPin, Phone, Mail, Clock, Award, Users, Heart } from "lucide-react";
import Navigation from "@/components/navigation";

export default function About() {
  const features = [
    {
      icon: Check,
      title: "Quality Care",
      description: "State-of-the-art equipment and advanced dental techniques",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Experienced professionals dedicated to your oral health",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Evening and weekend appointments available for your convenience",
    },
    {
      icon: Heart,
      title: "Patient-Centered",
      description: "Personalized treatment plans tailored to your specific needs",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Smith",
      role: "General Dentist & Practice Owner",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      description: "Dr. Smith has over 15 years of experience in general dentistry and is passionate about providing comprehensive care for patients of all ages.",
    },
    {
      name: "Dr. Michael Johnson",
      role: "Cosmetic Dentist",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      description: "Specializing in cosmetic dentistry, Dr. Johnson helps patients achieve their dream smiles through advanced aesthetic treatments.",
    },
    {
      name: "Dr. Emily Brown",
      role: "Orthodontist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      description: "Dr. Brown is an experienced orthodontist who provides both traditional braces and modern clear aligner treatments.",
    },
  ];

  return (
    <div className="min-h-screen bg-dental-light">
        <Navigation />
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About SmileCare Dental
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Providing exceptional dental care for over 15 years with a commitment to excellence, 
            compassion, and the latest in dental technology.
          </p>
        </div>

        {/* Hero Section with Image and Mission */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Modern dental clinic reception"
              className="rounded-xl shadow-lg w-full"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              At SmileCare Dental, we are committed to providing comprehensive, compassionate dental care 
              in a comfortable and welcoming environment. Our goal is to help every patient achieve optimal 
              oral health while maintaining a beautiful, confident smile.
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              We believe that quality dental care should be accessible to everyone, which is why we offer 
              flexible scheduling, accept most insurance plans, and provide payment options to fit your budget.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="service-icon mr-3" style={{ width: '40px', height: '40px', marginBottom: 0 }}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-900 mb-1">{feature.title}</h6>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our experienced team of dental professionals is dedicated to providing you with the highest quality care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-dental-primary font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology & Facilities */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">State-of-the-Art Facility</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our modern dental facility is equipped with the latest technology and designed with your comfort in mind. 
              From digital X-rays and intraoral cameras to laser dentistry and 3D imaging, we use advanced tools to 
              provide precise, efficient, and comfortable treatment.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-dental-success mr-3" />
                <span>Digital X-rays for reduced radiation exposure</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-dental-success mr-3" />
                <span>Intraoral cameras for enhanced diagnosis</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-dental-success mr-3" />
                <span>Laser dentistry for minimally invasive procedures</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-dental-success mr-3" />
                <span>3D imaging and CBCT for precise treatment planning</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-dental-success mr-3" />
                <span>Comfortable treatment rooms with entertainment systems</span>
              </li>
            </ul>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Modern dental treatment room"
              className="rounded-xl shadow-lg w-full"
            />
          </div>
        </div>

        {/* Contact & Visit Information */}
        <Card className="bg-white">
          <CardContent className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Modern Facility</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Located in the heart of the medical district, our state-of-the-art facility features the latest 
                  in dental technology and a comfortable, relaxing environment designed with your comfort in mind.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-dental-primary mr-3" />
                    <span className="text-gray-700">123 Health Street, Medical District, ST 12345</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-dental-primary mr-3" />
                    <span className="text-gray-700">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-dental-primary mr-3" />
                    <span className="text-gray-700">info@smilecare.com</span>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-dental-primary mr-3 mt-1" />
                    <div className="text-gray-700">
                      <div className="font-medium mb-1">Business Hours:</div>
                      <div className="text-sm space-y-1">
                        <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
                        <div>Saturday: 9:00 AM - 3:00 PM</div>
                        <div>Sunday: Closed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h4>
                <p className="text-gray-600 mb-6">
                  Schedule your appointment today and take the first step towards a healthier, brighter smile.
                </p>
                <div className="space-y-3">
                  <Link href="/booking">
                    <Button size="lg" className="bg-dental-primary hover:bg-dental-primary/90 w-full lg:w-auto">
                      Schedule Visit
                    </Button>
                  </Link>
                  <div className="text-sm text-gray-600">
                    Online booking available 24/7
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="service-icon mx-auto mb-4 bg-dental-primary">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compassionate Care</h3>
              <p className="text-gray-600">
                We treat every patient with kindness, understanding, and respect, ensuring a comfortable experience.
              </p>
            </div>
            <div className="text-center">
              <div className="service-icon mx-auto mb-4 bg-dental-success">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We maintain the highest standards of quality in all aspects of our practice and continuous education.
              </p>
            </div>
            <div className="text-center">
              <div className="service-icon mx-auto mb-4 bg-blue-500">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We're proud to serve our local community and build lasting relationships with our patients and their families.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
