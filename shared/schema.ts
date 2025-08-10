import { z } from "zod";

// Customers Schema
export const userSchema = z.object({
  id: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  profileImageUrl: z.string().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  age: z.string().optional(),
  address: z.string().optional(),
  role: z.string().default("patient"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Dentist Schema
export const dentistSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  experience: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertDentistSchema = dentistSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Dentist = z.infer<typeof dentistSchema>;
export type InsertDentist = z.infer<typeof insertDentistSchema>;

// Services Schema
export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  duration: z.number(), // duration in minutes
  category: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
});

export const insertServiceSchema = serviceSchema.omit({
  id: true,
  createdAt: true,
});

export type Service = z.infer<typeof serviceSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;

// Appointment Schema
export const appointmentStatusEnum = z.enum([
  "scheduled",
  "confirmed",
  "cancelled",
  "completed",
  "no_show"
]);

export const appointmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userFirstname: z.string().optional(),
  userEmail:z.string().email(),
  userPhone: z.string().optional(),
  dentistId: z.string(),
  dentistName: z.string(),
  dentistPhone: z.string().optional(),
  dentistSpecialization: z.string(),
  serviceId: z.string(),
  serviceName: z.string(),
  servicePrice: z.string(),
  serviceDuration: z.number(),
  serviceDescription: z.string(),
  appointmentDate: z.string(), // Store as ISO string for Firestore
  appointmentTime: z.string(), // Store as ISO string for Firestore
  status: appointmentStatusEnum.default("scheduled"),
  notes: z.string().optional(),
  totalCost: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertAppointmentSchema = appointmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Appointment = z.infer<typeof appointmentSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// Availability Schema
export const availabilitySchema = z.object({
  id: z.string(),
  dentistId: z.string(),
  date: z.string(), // Store as ISO date string
  startTime: z.string(), // Store as time string (HH:mm)
  endTime: z.string(), // Store as time string (HH:mm)
  isAvailable: z.boolean().default(true),
  createdAt: z.date(),
});

export const insertAvailabilitySchema = availabilitySchema.omit({
  id: true,
  createdAt: true,
});

export type Availability = z.infer<typeof availabilitySchema>;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;

// Extended types for API responses
export type AppointmentWithDetails = Appointment & {
  user: User;
  dentist: Dentist;
  service: Service;
};

export type DentistWithAvailability = Dentist & {
  availability: Availability[];
};

// Firebase document interfaces for Firestore conversion
export interface FirebaseUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  profileImageUrl?: string;
  phone?: string;
  role?: string;
  age?: string;
  gender?: string;
  address?: string;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface FirebaseDentist {
  id?: string;
  name: string;
  specialization?: string;
  experience?: string;
  imageUrl?: string;
  isActive?: boolean;
  phone?:string;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface FirebaseService {
  id?: string;
  name: string;
  description: string;
  price: string;
  duration: number;
  category?: string;
  isActive?: boolean;
  createdAt?: any; // Firestore Timestamp
}

export interface FirebaseAppointment {
  id?: string;
  userId: string;
  userFirstname?: string;
  userEmail: string;
  userPhone?: string;
  dentistId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: string;
  serviceDuration: number;
  serviceDescription: string;
  dentistName: string,
  dentistPhone?: string,
  dentistSpecialization: string,
  appointmentDate: string;
  appointmentTime: string;
  status?: string;
  notes?: string;
  totalCost?: number;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface FirebaseAvailability {
  id?: string;
  dentistId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
  createdAt?: any; // Firestore Timestamp
}