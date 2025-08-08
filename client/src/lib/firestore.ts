import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  DENTISTS: "dentists", 
  SERVICES: "services",
  APPOINTMENTS: "appointments",
  AVAILABILITY: "availability"
};

// User operations
export const userService = {
  async create(userId: string, userData: any) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return userRef;
  },

  async get(userId: string) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
  },

  async update(userId: string, userData: any) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    });
  }
};

// Service operations
export const serviceService = {
  async getAll() {
    const servicesRef = collection(db, COLLECTIONS.SERVICES);
    const servicesSnap = await getDocs(servicesRef);
    return servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async create(serviceData: any) {
    const servicesRef = collection(db, COLLECTIONS.SERVICES);
    return await addDoc(servicesRef, {
      ...serviceData,
      createdAt: Timestamp.now(),
    });
  }
};

// Dentist operations
export const dentistService = {
  async getAll() {
    const dentistsRef = collection(db, COLLECTIONS.DENTISTS);
    const dentistsSnap = await getDocs(dentistsRef);
    return dentistsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async create(dentistData: any) {
    const dentistsRef = collection(db, COLLECTIONS.DENTISTS);
    return await addDoc(dentistsRef, {
      ...dentistData,
      createdAt: Timestamp.now(),
    });
  }
};

// Appointment operations
export const appointmentService = {
  async getAll() {
    const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS);
    const appointmentsSnap = await getDocs(query(appointmentsRef, orderBy("appointmentDate", "desc")));
    return appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getByUserId(userId: string) {
    const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS);
    const q = query(appointmentsRef, where("userId", "==", userId), orderBy("appointmentDate", "desc"));
    const appointmentsSnap = await getDocs(q);
    return appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async create(appointmentData: any) {
    const appointmentsRef = collection(db, COLLECTIONS.APPOINTMENTS);
    return await addDoc(appointmentsRef, {
      ...appointmentData,
      createdAt: Timestamp.now(),
    });
  },

  async update(appointmentId: string, appointmentData: any) {
    const appointmentRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
    await updateDoc(appointmentRef, {
      ...appointmentData,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(appointmentId: string) {
    const appointmentRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
    await deleteDoc(appointmentRef);
  }
};

// Availability operations
export const availabilityService = {
  async getByDentistAndDate(dentistId: string, date: string) {
    const availabilityRef = collection(db, COLLECTIONS.AVAILABILITY);
    const q = query(
      availabilityRef, 
      where("dentistId", "==", dentistId),
      where("date", "==", date)
    );
    const availabilitySnap = await getDocs(q);
    return availabilitySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};