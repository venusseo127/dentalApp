import { createService, createDentist } from "./firestore";

// Initialize sample data for Firebase
export async function initializeSampleData() {
  try {
    // Sample services
    const services = [
      {
        name: "Regular Cleaning",
        description: "Professional dental cleaning and examination",
        duration: 60,
        price: 120,
        category: "Preventive"
      },
      {
        name: "Teeth Whitening",
        description: "Professional teeth whitening treatment",
        duration: 90,
        price: 300,
        category: "Cosmetic"
      },
      {
        name: "Dental Filling",
        description: "Cavity filling treatment",
        duration: 45,
        price: 180,
        category: "Restorative"
      },
      {
        name: "Root Canal",
        description: "Root canal therapy",
        duration: 120,
        price: 800,
        category: "Endodontic"
      }
    ];

    // Sample dentists
    const dentists = [
      {
        name: "Dr. Sarah Johnson",
        specialization: "General Dentistry",
        email: "sarah.johnson@dentalcare.com",
        phone: "(555) 123-4567",
        experience: 8,
        isActive: true,
        bio: "Experienced general dentist with focus on preventive care"
      },
      {
        name: "Dr. Michael Chen",
        specialization: "Orthodontics",
        email: "michael.chen@dentalcare.com",
        phone: "(555) 234-5678",
        experience: 12,
        isActive: true,
        bio: "Specialist in orthodontic treatments and teeth alignment"
      },
      {
        name: "Dr. Emily Davis",
        specialization: "Cosmetic Dentistry",
        email: "emily.davis@dentalcare.com",
        phone: "(555) 345-6789",
        experience: 10,
        isActive: true,
        bio: "Expert in cosmetic dental procedures and smile makeovers"
      }
    ];

    // Add services to Firestore
    for (const service of services) {
      await createService(service);
    }

    // Add dentists to Firestore
    for (const dentist of dentists) {
      await createDentist(dentist);
    }

    console.log("Sample data initialized successfully");
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}