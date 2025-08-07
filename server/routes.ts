import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertAppointmentSchema, insertDentistSchema, insertServiceSchema, insertAvailabilitySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dentist routes
  app.get('/api/dentists', async (req, res) => {
    try {
      const dentists = await storage.getDentists();
      res.json(dentists);
    } catch (error) {
      console.error("Error fetching dentists:", error);
      res.status(500).json({ message: "Failed to fetch dentists" });
    }
  });

  app.get('/api/dentists/:id', async (req, res) => {
    try {
      const dentist = await storage.getDentist(req.params.id);
      if (!dentist) {
        return res.status(404).json({ message: "Dentist not found" });
      }
      res.json(dentist);
    } catch (error) {
      console.error("Error fetching dentist:", error);
      res.status(500).json({ message: "Failed to fetch dentist" });
    }
  });

  app.post('/api/dentists', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }

      const dentistData = insertDentistSchema.parse(req.body);
      const dentist = await storage.createDentist(dentistData);
      res.status(201).json(dentist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid dentist data", errors: error.errors });
      }
      console.error("Error creating dentist:", error);
      res.status(500).json({ message: "Failed to create dentist" });
    }
  });

  // Service routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }

      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  // Appointment routes
  app.get('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      let appointments;
      if (user?.role === 'admin') {
        appointments = await storage.getAppointments();
      } else {
        appointments = await storage.getAppointmentsByUser(userId);
      }
      
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get('/api/appointments/date/:date', isAuthenticated, async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByDate(req.params.date);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments by date:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        userId,
      });
      
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  app.put('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user owns the appointment or is admin
      const appointments = await storage.getAppointmentsByUser(userId);
      const appointment = appointments.find(a => a.id === req.params.id);
      
      if (!appointment && user?.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized: Cannot modify this appointment" });
      }

      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      const updatedAppointment = await storage.updateAppointment(req.params.id, appointmentData);
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user owns the appointment or is admin
      const appointments = await storage.getAppointmentsByUser(userId);
      const appointment = appointments.find(a => a.id === req.params.id);
      
      if (!appointment && user?.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized: Cannot delete this appointment" });
      }

      await storage.deleteAppointment(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  // Availability routes
  app.get('/api/availability/:dentistId/:date', async (req, res) => {
    try {
      const { dentistId, date } = req.params;
      const availability = await storage.getAvailability(dentistId, date);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  app.post('/api/availability', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }

      const availabilityData = insertAvailabilitySchema.parse(req.body);
      const availability = await storage.createAvailability(availabilityData);
      res.status(201).json(availability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid availability data", errors: error.errors });
      }
      console.error("Error creating availability:", error);
      res.status(500).json({ message: "Failed to create availability" });
    }
  });

  // Admin dashboard stats
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = await storage.getAppointmentsByDate(today);
      const allAppointments = await storage.getAppointments();
      const dentists = await storage.getDentists();

      // Get unique patients
      const uniquePatients = new Set(allAppointments.map(a => a.userId));

      const stats = {
        todayAppointments: todayAppointments.length,
        totalPatients: uniquePatients.size,
        activeDentists: dentists.filter(d => d.isActive).length,
        totalAppointments: allAppointments.length,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
