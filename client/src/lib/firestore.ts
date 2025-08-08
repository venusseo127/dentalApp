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

// Collection references
export const usersCollection = collection(db, "users");
export const dentistsCollection = collection(db, "dentists");
export const servicesCollection = collection(db, "services");
export const appointmentsCollection = collection(db, "appointments");
export const availabilityCollection = collection(db, "availability");

// TypeScript interfaces
export interface User {
  id: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: string;
  address?: string;
  phone?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Dentist {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  email: string;
  phone: string;
  bio?: string;
  available: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  available: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Appointment {
  id: string;
  userId: string;
  dentistId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Availability {
  id: string;
  dentistId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// User operations
export const getUserByUid = async (uid: string): Promise<User | null> => {
  const snapshot = await getDocs(query(usersCollection, where("uid", "==", uid)));
  if (snapshot.docs.length > 0) {
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as User;
  }
  return null;
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const docRef = await addDoc(usersCollection, {
    ...userData,
    createdAt: Timestamp.now(),
  });
  return {
    id: docRef.id,
    ...userData,
    createdAt: new Date(),
  };
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: Timestamp.now(),
  });
};

// Service operations
export const getServices = async (): Promise<Service[]> => {
  const snapshot = await getDocs(query(servicesCollection, orderBy("name")));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Service[];
};

export const createService = async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
  const docRef = await addDoc(servicesCollection, {
    ...serviceData,
    createdAt: Timestamp.now(),
  });
  return {
    id: docRef.id,
    ...serviceData,
    createdAt: new Date(),
  };
};

export const updateService = async (serviceId: string, serviceData: Partial<Service>): Promise<void> => {
  const serviceRef = doc(db, "services", serviceId);
  await updateDoc(serviceRef, {
    ...serviceData,
    updatedAt: Timestamp.now(),
  });
};

// Dentist operations
export const getDentists = async (): Promise<Dentist[]> => {
  const snapshot = await getDocs(query(dentistsCollection, orderBy("name")));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Dentist[];
};

export const createDentist = async (dentistData: Omit<Dentist, 'id'>): Promise<Dentist> => {
  const docRef = await addDoc(dentistsCollection, {
    ...dentistData,
    createdAt: Timestamp.now(),
  });
  return {
    id: docRef.id,
    ...dentistData,
    createdAt: new Date(),
  };
};

export const updateDentist = async (dentistId: string, dentistData: Partial<Dentist>): Promise<void> => {
  const dentistRef = doc(db, "dentists", dentistId);
  await updateDoc(dentistRef, {
    ...dentistData,
    updatedAt: Timestamp.now(),
  });
};

// Appointment operations
export const getAppointments = async (): Promise<Appointment[]> => {
  const snapshot = await getDocs(query(appointmentsCollection, orderBy("date", "desc")));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Appointment[];
};

export const getAppointmentsByUserId = async (userId: string): Promise<Appointment[]> => {
  const snapshot = await getDocs(query(appointmentsCollection, where("userId", "==", userId), orderBy("date", "desc")));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Appointment[];
};

export const createAppointment = async (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
  const docRef = await addDoc(appointmentsCollection, {
    ...appointmentData,
    date: Timestamp.fromDate(appointmentData.date),
    createdAt: Timestamp.now(),
  });
  return {
    id: docRef.id,
    ...appointmentData,
    createdAt: new Date(),
  };
};

export const updateAppointment = async (appointmentId: string, appointmentData: Partial<Appointment>): Promise<void> => {
  const appointmentRef = doc(db, "appointments", appointmentId);
  await updateDoc(appointmentRef, {
    ...appointmentData,
    ...(appointmentData.date && { date: Timestamp.fromDate(appointmentData.date) }),
    updatedAt: Timestamp.now(),
  });
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  const appointmentRef = doc(db, "appointments", appointmentId);
  await deleteDoc(appointmentRef);
};

// Availability operations
export const getAvailabilityByDentistAndDate = async (dentistId: string, date: string): Promise<Availability[]> => {
  const snapshot = await getDocs(query(
    availabilityCollection, 
    where("dentistId", "==", dentistId),
    where("dayOfWeek", "==", new Date(date).getDay())
  ));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Availability[];
};

export const createAvailability = async (availabilityData: Omit<Availability, 'id'>): Promise<Availability> => {
  const docRef = await addDoc(availabilityCollection, {
    ...availabilityData,
    createdAt: Timestamp.now(),
  });
  return {
    id: docRef.id,
    ...availabilityData,
    createdAt: new Date(),
  };
};

export const updateAvailability = async (availabilityId: string, availabilityData: Partial<Availability>): Promise<void> => {
  const availabilityRef = doc(db, "availability", availabilityId);
  await updateDoc(availabilityRef, {
    ...availabilityData,
    updatedAt: Timestamp.now(),
  });
};

