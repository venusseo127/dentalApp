import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, User } from "lucide-react";
import { Link } from "wouter";
import type { AppointmentWithDetails } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  const { data: appointments = [] } = useQuery<any[]>({
    queryKey: ["appointments", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const { getAppointmentsByUserId } = await import("@/lib/firestore");
      return await getAppointmentsByUserId(user.uid);
    },
    enabled: !!user?.uid,
  });

  const upcomingAppointments = appointments.filter((apt) => 
    new Date(apt.appointmentDate) >= new Date()
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, {(user as any)?.firstName || 'Patient'}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your dental care overview</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Link href="/booking">
                  <Button className="w-full justify-start" size="lg">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book New Appointment
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Clock className="mr-2 h-5 w-5" />
                    View All Appointments
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No upcoming appointments</p>
                    <Link href="/booking">
                      <Button className="mt-4">Book Your First Appointment</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <User className="h-6 w-6 text-primary-600" />
                          </div>
                          <div>
                            <div className="font-medium text-secondary-900">
                              {(appointment as any).service?.name || 'Service'}
                            </div>
                            <div className="text-sm text-gray-600">
                              with {(appointment as any).dentist?.name || 'Dentist'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(appointment.appointmentDate).toLocaleDateString()} at{" "}
                              {appointment.appointmentTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-primary-600">
                            ${(appointment as any).service?.price || '0'}
                          </div>
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
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center">
                  <span className="font-medium w-16">Phone:</span>
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-16">Email:</span>
                  <span>info@dentalcare.com</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium w-16">Address:</span>
                  <span>123 Medical Plaza<br />Suite 100<br />City, State 12345</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
