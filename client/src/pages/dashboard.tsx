import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Plus, Phone, Mail, MapPin, User as UserIcon } from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Appointment } from "@shared/schema";
import DateTimeSelection from "@/components/booking/date-time-selection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, LogIn, ArrowLeft } from "lucide-react";
import { updateAppointment, getAppointmentsByUserId, updateUser } from "@/lib/firestore";

interface RescheduleData {
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
}

interface SignupFormData {
  lastName: string;
  age: string;
  gender: string;
  address: string;
  phone: string;
}
export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEditProfile, setDialogEditProfile] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<RescheduleData>({
      appointmentId: "",
      appointmentDate: "",
      appointmentTime: ""
  
    });
  
  const [processing, setProcessing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log(user)
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const [formData, setFormData] = useState<SignupFormData>({
      lastName: user?.lastName || '',
      age: user?.age || '',
      gender: user?.gender || '',
      address: user?.address || '',
      phone: user?.phone || '',
  });
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["appointments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getAppointmentsByUserId(user.id);
    },
    enabled: !!user?.id,
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      await updateAppointment(appointmentId, { status: "cancelled" });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        // User will need to login again with Firebase
        window.location.reload();
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to cancel appointment",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter((apt) => 
    new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter((apt) => 
    new Date(apt.appointmentDate) < new Date() || apt.status === 'completed'
  );

  const handleCancel = (appointmentId: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointmentMutation.mutate(appointmentId);
    }
  };
  const updateBookingData = (updates: Partial<Appointment>) => {
    console.log("date",updates)
    if(updates.id){
      const existingAppointment = appointments.find(appId => appId.id === updates.id);
      if (existingAppointment) {
        setDialogOpen(true);
        setSelectedAppointment({appointmentId:updates.id,appointmentDate:existingAppointment.appointmentDate,appointmentTime:existingAppointment.appointmentTime});
      }
    }else{
      setSelectedAppointment(prev => ({ ...prev, ...updates }));
    }
  };
  const handleReschedule = () => {
    console.log(selectedAppointment)
    rescheduleAppointmentMutation.mutate(selectedAppointment);
      
  };
  const rescheduleAppointmentMutation = useMutation({
    mutationFn: async (updateData: RescheduleData) => {
      await updateAppointment(updateData.appointmentId, { appointmentDate: updateData.appointmentDate,appointmentTime:updateData.appointmentTime });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment schedule successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        // User will need to login again with Firebase
        window.location.reload();
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment schedule",
        variant: "destructive",
      });
      setDialogOpen(false);
    },
  });
  const handleDialogClose = ( d: number) => {
    if(d==1){
      setDialogOpen(false);
    }else{
      setDialogEditProfile(false);
    }
    console.log("close"+d)
    //setEditingCustomer(null);
    //form.reset();
  };
  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const validateForm = (): boolean => {
    // if (!formData.password || !formData.lastName) {
    //   toast({
    //     title: "Missing Required Fields",
    //     description: "Please fill in all required fields",
    //     variant: "destructive",
    //   });
    //   return false;
    // }

    // if (formData.password !== formData.confirmPassword) {
    //   toast({
    //     title: "Password Mismatch",
    //     description: "Passwords do not match",
    //     variant: "destructive",
    //   });
    //   return false;
    // }

    // if (formData.password.length < 6) {
    //   toast({
    //     title: "Password Too Short",
    //     description: "Password must be at least 6 characters",
    //     variant: "destructive",
    //   });
    //   return false;
    // }

    const age = parseInt(formData.age);
    if (formData.age && (isNaN(age) || age < 1 || age > 120)) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age between 1 and 120",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };
  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoadingForm(true);
      if (!user?.id) throw new Error("User not authenticated");
      // Update fields on db
      await updateUser(user.id,{
        lastName: formData.lastName,
        phone: formData.phone,
        profileImageUrl:'',
        age: formData.age,
        gender:formData.gender,
        address:formData.address,
        role: "patient",
      });
      toast({
        title: "Account Updated Successfully!",
        description: "Profile Updated",
      });
      
      setDialogEditProfile(false);
    } catch (error: any) {
      console.error("Edit Profile error:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to edit account",
        variant: "destructive",
      });
    } finally {
      setIsLoadingForm(false);
    }
  };
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">My Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your appointments and profile</p>
          </div>
          <Link href="/booking">
            <Button className="bg-primary-500 hover:bg-primary-600">
              <Plus className="mr-2 h-4 w-4" />
              Book New Appointment
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">No upcoming appointments</p>
                    <Link href="/booking">
                      <Button>Book Your Next Appointment</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment: any) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary-600" />
                          </div>
                          <div>
                            <div className="font-medium text-secondary-900">
                              {appointment.serviceName}
                            </div>
                            <div className="text-sm text-gray-600">
                              with {appointment.dentistName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(appointment.appointmentDate).toLocaleDateString()} at{" "}
                              {appointment.appointmentTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(appointment.id)}
                            disabled={cancelAppointmentMutation.isPending}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateBookingData({ id:appointment.id })}
                            //disabled={cancelAppointmentMutation.isPending}
                          >
                            Reschedule
                          </Button>
                          
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
              </CardContent>
            </Card>
                
            {/* Past Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Past Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {pastAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No past appointments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastAppointments.slice(0, 5).map((appointment: any) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-secondary-900">
                              {appointment.serviceName}
                            </div>
                            <div className="text-sm text-gray-600">
                              with {appointment.dentistName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(appointment.appointmentDate).toLocaleDateString()} at{" "}
                              {appointment.appointmentTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-green-600 font-medium text-sm">
                          {appointment.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
              
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <img
                    src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-secondary-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setDialogEditProfile(true)}>
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/booking">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Medical History
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Calendar className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Phone className="mr-3 h-4 w-4 text-primary-600" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 h-4 w-4 text-primary-600" />
                  <span>info@dentalcare.com</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 h-4 w-4 text-primary-600 mt-1" />
                  <span>123 Medical Plaza<br />Suite 100<br />City, State 12345</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Reschedule Appointment Dialog */}
        <Dialog  open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent >
            <DialogHeader>
              <DialogTitle>
                Edit Appointment 
              </DialogTitle>
            </DialogHeader>
            { selectedAppointment  &&(
              <DateTimeSelection
                selectedDate={selectedAppointment.appointmentDate}
                selectedTime={selectedAppointment.appointmentTime}
                dentistId=''
                onDateSelect={(date) => updateBookingData({ appointmentDate: date })}
                onTimeSelect={(time) => updateBookingData({ appointmentTime: time })}
              />
            )}
              
            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => handleDialogClose(1)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" onClick={() => handleReschedule()}>
                Update Appointment
                {processing ? "Updating ..." : "Process Update"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog  open={dialogEditProfile} onOpenChange={setDialogEditProfile}>
          <DialogContent >
            <DialogHeader>
              <DialogTitle>
                Edit Profile 
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditProfile} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={user?.firstName}
                    disabled 
                    
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  disabled 
                  placeholder="Enter your email"
                  value={user?.email}
                  
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    min="1"
                    max="120"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              {/* Password */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                </div>
              </div> */}
            
              <div className="flex space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(2)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isLoading ? "Updating ..." : "Process Update"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
