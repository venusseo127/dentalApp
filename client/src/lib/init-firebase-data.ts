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
        price: "120",
        category: "Preventive",
        isActive: true
      },
      {
        name: "Teeth Whitening",
        description: "Professional teeth whitening treatment",
        duration: 90,
        price: "300",
        category: "Cosmetic",
        isActive: true
      },
      {
        name: "Dental Filling",
        description: "Cavity filling treatment",
        duration: 45,
        price: "180",
        category: "Restorative",
        isActive: true
      },
      {
        name: "Root Canal",
        description: "Root canal therapy",
        duration: 120,
        price: "800",
        category: "Endodontic",
        isActive: true
      }
    ];

    // Sample dentists
    const dentists = [
      {
        name: "Dr. Sarah Johnson",
        specialization: "General Dentistry",
        experience: "8 years",
        imageUrl: "",
        isAvailable: true,
        isActive: true
      },
      {
        name: "Dr. Michael Chen",
        specialization: "Orthodontics",
        experience: "12 years",
        imageUrl: "",
        isAvailable: true,
        isActive: true
      },
      {
        name: "Dr. Emily Davis",
        specialization: "Cosmetic Dentistry",
        experience: "10 years",
        imageUrl: "",
        isAvailable: true,
        isActive: true
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