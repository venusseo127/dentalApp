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
import { 
  User, 
  InsertUser, 
  Dentist, 
  InsertDentist, 
  Service, 
  InsertService, 
  Appointment, 
  InsertAppointment,
  Availability,
  InsertAvailability,
  FirebaseUser,
  FirebaseDentist,
  FirebaseService,
  FirebaseAppointment,
  FirebaseAvailability,
  userSchema,
  dentistSchema,
  serviceSchema,
  appointmentSchema,
  availabilitySchema
} from "@shared/schema";

// Collection references
export const usersCollection = collection(db, "users");
export const dentistsCollection = collection(db, "dentists");
export const servicesCollection = collection(db, "services");
export const appointmentsCollection = collection(db, "appointments");
export const availabilityCollection = collection(db, "availability");

// Helper function to convert Firestore Timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};

// Helper function to convert Firebase document to typed object
const convertFirebaseUser = (doc: any): User => {
  const data = doc.data() as FirebaseUser;
  return userSchema.parse({
    id: doc.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    profileImageUrl: data.profileImageUrl,
    phone: data.phone,
    age:data.age || '',
    gender:data.gender || '',
    address:data.address || '',
    role: data.role || "patient",
    createdAt: data.createdAt ? convertTimestamp(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? convertTimestamp(data.updatedAt) : new Date(),
  });
};

const convertFirebaseDentist = (doc: any): Dentist => {
  const data = doc.data() as FirebaseDentist;
  return dentistSchema.parse({
    id: doc.id,
    name: data.name,
    specialization: data.specialization,
    experience: data.experience,
    phone:data.phone,
    imageUrl: data.imageUrl || '',
    isActive: data.isActive ?? true,
    createdAt: data.createdAt ? convertTimestamp(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? convertTimestamp(data.updatedAt) : new Date(),
  });
};

const convertFirebaseService = (doc: any): Service => {
  const data = doc.data() as FirebaseService;
  return serviceSchema.parse({
    id: doc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    duration: data.duration,
    category: data.category,
    isActive: data.isActive ?? true,
    createdAt: data.createdAt ? convertTimestamp(data.createdAt) : new Date(),
  });
};

const convertFirebaseAppointment = (doc: any): Appointment => {
  const data = doc.data() as FirebaseAppointment;
  return appointmentSchema.parse({
    id: doc.id,
    userId: data.userId,  
    userFirstname: data.userFirstname,
    userEmail: data.userEmail,
    userPhone: data.userPhone || '',
    dentistId: data.dentistId,   
    dentistName: data.dentistName,
    dentistPhone: data.dentistPhone || '',
    dentistSpecialization: data.dentistSpecialization, 
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    servicePrice: data.servicePrice,
    serviceDuration: data.serviceDuration,
    serviceDescription: data.serviceDescription,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    status: data.status || "scheduled",
    notes: data.notes,
    totalCost: data.totalCost,
    createdAt: data.createdAt ? convertTimestamp(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? convertTimestamp(data.updatedAt) : new Date(),
  });
};

const convertFirebaseAvailability = (doc: any): Availability => {
  const data = doc.data() as FirebaseAvailability;
  return availabilitySchema.parse({
    id: doc.id,
    dentistId: data.dentistId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    isAvailable: data.isAvailable ?? true,
    createdAt: data.createdAt ? convertTimestamp(data.createdAt) : new Date(),
  });
};

// User functions
export const getUserByUid = async (uid: string): Promise<User | null> => {
  try {
    const q = query(usersCollection, where("id", "==", uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return convertFirebaseUser(querySnapshot.docs[0]);
  } catch (error) {
    console.error("Error getting user by UID:", error);
    return null;
  }
};

export const createUser = async (userData: Omit<InsertUser, 'id'> & { uid: string }): Promise<User> => {
  try { 
    // Check if user already exists
    const existingUser = await getUserByUid(userData.uid);
    if (existingUser) {
      return existingUser;
    }

    const now = Timestamp.now();
    const docData: FirebaseUser = {
      id: userData.uid,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      profileImageUrl: userData.profileImageUrl,
      phone: userData.phone,
      role: userData.role || "patient",
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(usersCollection, docData);
    const userDoc = await getDoc(docRef);
    return convertFirebaseUser(userDoc);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, updates: Partial<InsertUser>): Promise<void> => {
  try {
    const userRef = doc(usersCollection, id);
    const updateData: Partial<FirebaseUser> = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Dentist functions
export const getDentists = async (): Promise<Dentist[]> => {
  try {
    const q = query(dentistsCollection, orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirebaseDentist);
  } catch (error) {
    console.error("Error getting dentists:", error);
    throw error;
  }
};

export const createDentist = async (dentistData: InsertDentist): Promise<Dentist> => {
  try {
    const now = Timestamp.now();
    const docData: FirebaseDentist = {
      ...dentistData,
      isActive: dentistData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(dentistsCollection, docData);
    const dentistDoc = await getDoc(docRef);
    return convertFirebaseDentist(dentistDoc);
  } catch (error) {
    console.error("Error creating dentist:", error);
    throw error;
  }
};

// Service functions
export const getServices = async (): Promise<Service[]> => {
  try {
    const q = query(servicesCollection, where("isActive", "==", true), orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirebaseService);
  } catch (error) {
    console.error("Error getting services:", error);
    throw error;
  }
};

export const createService = async (serviceData: InsertService): Promise<Service> => {
  try {
    const now = Timestamp.now();
    const docData: FirebaseService = {
      ...serviceData,
      isActive: serviceData.isActive ?? true,
      createdAt: now,
    };
    
    const docRef = await addDoc(servicesCollection, docData);
    const serviceDoc = await getDoc(docRef);
    return convertFirebaseService(serviceDoc);
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

// Appointment functions
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const q = query(appointmentsCollection, orderBy("appointmentDate", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirebaseAppointment);
  } catch (error) {
    console.error("Error getting appointments:", error);
    throw error;
  }
};

export const getAppointmentsByUserId = async (userId: string): Promise<Appointment[]> => {
  try {
    const q = query(appointmentsCollection, where("userId", "==", userId), orderBy("appointmentDate", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirebaseAppointment);
  } catch (error) {
    console.error("Error getting appointments by user ID:", error);
    throw error;
  }
};

export const createAppointment = async (appointmentData: InsertAppointment): Promise<Appointment> => {
  try {
    const now = Timestamp.now();
    const docData: FirebaseAppointment = {
      ...appointmentData,
      status: appointmentData.status || "scheduled",
      createdAt: now,
      updatedAt: now,
    };
    console.log(docData)
    const docRef = await addDoc(appointmentsCollection, docData);
    const appointmentDoc = await getDoc(docRef);
    return convertFirebaseAppointment(appointmentDoc);
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const updateAppointment = async (id: string, updates: Partial<InsertAppointment>): Promise<void> => {
  try {
    const appointmentRef = doc(appointmentsCollection, id);
    const updateData: Partial<FirebaseAppointment> = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(appointmentRef, updateData);
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Availability functions
export const getAvailabilityByDentist = async (dentistId: string): Promise<Availability[]> => {
  try {
    const q = query(availabilityCollection, where("dentistId", "==", dentistId), orderBy("date"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirebaseAvailability);
  } catch (error) {
    console.error("Error getting availability by dentist:", error);
    throw error;
  }
};

export const createAvailability = async (availabilityData: InsertAvailability): Promise<Availability> => {
  try {
    const now = Timestamp.now();
    const docData: FirebaseAvailability = {
      ...availabilityData,
      isAvailable: availabilityData.isAvailable ?? true,
      createdAt: now,
    };
    
    const docRef = await addDoc(availabilityCollection, docData);
    const availabilityDoc = await getDoc(docRef);
    return convertFirebaseAvailability(availabilityDoc);
  } catch (error) {
    console.error("Error creating availability:", error);
    throw error;
  }
};