import {
  users,
  dentists,
  services,
  appointments,
  availability,
  type User,
  type UpsertUser,
  type Dentist,
  type InsertDentist,
  type Service,
  type InsertService,
  type Appointment,
  type InsertAppointment,
  type AppointmentWithDetails,
  type Availability,
  type InsertAvailability,
  type DentistWithAvailability,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for  Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Dentist operations
  getDentists(): Promise<Dentist[]>;
  getDentist(id: string): Promise<Dentist | undefined>;
  createDentist(dentist: InsertDentist): Promise<Dentist>;
  updateDentist(id: string, dentist: Partial<InsertDentist>): Promise<Dentist>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Appointment operations
  getAppointments(): Promise<AppointmentWithDetails[]>;
  getAppointmentsByUser(userId: string): Promise<AppointmentWithDetails[]>;
  getAppointmentsByDentist(dentistId: string): Promise<AppointmentWithDetails[]>;
  getAppointmentsByDate(date: string): Promise<AppointmentWithDetails[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: string): Promise<void>;
  
  // Availability operations
  getAvailability(dentistId: string, date: string): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: string, availability: Partial<InsertAvailability>): Promise<Availability>;
  getDentistWithAvailability(dentistId: string): Promise<DentistWithAvailability | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Dentist operations
  async getDentists(): Promise<Dentist[]> {
    return await db.select().from(dentists).where(eq(dentists.isActive, true)).orderBy(asc(dentists.name));
  }

  async getDentist(id: string): Promise<Dentist | undefined> {
    const [dentist] = await db.select().from(dentists).where(eq(dentists.id, id));
    return dentist;
  }

  async createDentist(dentistData: InsertDentist): Promise<Dentist> {
    const [dentist] = await db.insert(dentists).values(dentistData).returning();
    return dentist;
  }

  async updateDentist(id: string, dentistData: Partial<InsertDentist>): Promise<Dentist> {
    const [dentist] = await db
      .update(dentists)
      .set({ ...dentistData, updatedAt: new Date() })
      .where(eq(dentists.id, id))
      .returning();
    return dentist;
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.name));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(serviceData: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(serviceData).returning();
    return service;
  }

  // Appointment operations
  async getAppointments(): Promise<AppointmentWithDetails[]> {
    return await db
      .select({
        id: appointments.id,
        userId: appointments.userId,
        dentistId: appointments.dentistId,
        serviceId: appointments.serviceId,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        status: appointments.status,
        notes: appointments.notes,
        totalCost: appointments.totalCost,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        user: users,
        dentist: dentists,
        service: services,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.userId, users.id))
      .innerJoin(dentists, eq(appointments.dentistId, dentists.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .orderBy(desc(appointments.appointmentDate), desc(appointments.appointmentTime));
  }

  async getAppointmentsByUser(userId: string): Promise<AppointmentWithDetails[]> {
    return await db
      .select({
        id: appointments.id,
        userId: appointments.userId,
        dentistId: appointments.dentistId,
        serviceId: appointments.serviceId,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        status: appointments.status,
        notes: appointments.notes,
        totalCost: appointments.totalCost,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        user: users,
        dentist: dentists,
        service: services,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.userId, users.id))
      .innerJoin(dentists, eq(appointments.dentistId, dentists.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.appointmentDate), desc(appointments.appointmentTime));
  }

  async getAppointmentsByDentist(dentistId: string): Promise<AppointmentWithDetails[]> {
    return await db
      .select({
        id: appointments.id,
        userId: appointments.userId,
        dentistId: appointments.dentistId,
        serviceId: appointments.serviceId,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        status: appointments.status,
        notes: appointments.notes,
        totalCost: appointments.totalCost,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        user: users,
        dentist: dentists,
        service: services,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.userId, users.id))
      .innerJoin(dentists, eq(appointments.dentistId, dentists.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.dentistId, dentistId))
      .orderBy(desc(appointments.appointmentDate), desc(appointments.appointmentTime));
  }

  async getAppointmentsByDate(date: string): Promise<AppointmentWithDetails[]> {
    return await db
      .select({
        id: appointments.id,
        userId: appointments.userId,
        dentistId: appointments.dentistId,
        serviceId: appointments.serviceId,
        appointmentDate: appointments.appointmentDate,
        appointmentTime: appointments.appointmentTime,
        status: appointments.status,
        notes: appointments.notes,
        totalCost: appointments.totalCost,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        user: users,
        dentist: dentists,
        service: services,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.userId, users.id))
      .innerJoin(dentists, eq(appointments.dentistId, dentists.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.appointmentDate, date))
      .orderBy(asc(appointments.appointmentTime));
  }

  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(appointmentData).returning();
    return appointment;
  }

  async updateAppointment(id: string, appointmentData: Partial<InsertAppointment>): Promise<Appointment> {
    const [appointment] = await db
      .update(appointments)
      .set({ ...appointmentData, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async deleteAppointment(id: string): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  // Availability operations
  async getAvailability(dentistId: string, date: string): Promise<Availability[]> {
    return await db
      .select()
      .from(availability)
      .where(and(eq(availability.dentistId, dentistId), eq(availability.date, date)))
      .orderBy(asc(availability.startTime));
  }

  async createAvailability(availabilityData: InsertAvailability): Promise<Availability> {
    const [newAvailability] = await db.insert(availability).values(availabilityData).returning();
    return newAvailability;
  }

  async updateAvailability(id: string, availabilityData: Partial<InsertAvailability>): Promise<Availability> {
    const [updatedAvailability] = await db
      .update(availability)
      .set(availabilityData)
      .where(eq(availability.id, id))
      .returning();
    return updatedAvailability;
  }

  async getDentistWithAvailability(dentistId: string): Promise<DentistWithAvailability | undefined> {
    const dentist = await this.getDentist(dentistId);
    if (!dentist) return undefined;

    const dentistAvailability = await db
      .select()
      .from(availability)
      .where(and(eq(availability.dentistId, dentistId), gte(availability.date, new Date().toISOString().split('T')[0])))
      .orderBy(asc(availability.date), asc(availability.startTime));

    return {
      ...dentist,
      availability: dentistAvailability,
    };
  }
}

export const storage = new DatabaseStorage();
