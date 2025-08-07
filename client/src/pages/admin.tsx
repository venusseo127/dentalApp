import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, UserRound, Clock, Plus, Download, Settings, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    retry: false,
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
    retry: false,
  });

  const { data: dentists = [] } = useQuery({
    queryKey: ["/api/dentists"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((apt: any) => 
    apt.appointmentDate === today
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage dentists, schedules, and appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-secondary-900">
                    {stats?.todayAppointments || todayAppointments.length}
                  </div>
                  <div className="text-gray-600 text-sm">Today's Appointments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-secondary-900">
                    {stats?.totalPatients || new Set(appointments.map((a: any) => a.userId)).size}
                  </div>
                  <div className="text-gray-600 text-sm">Total Patients</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserRound className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-secondary-900">
                    {stats?.activeDentists || dentists.filter((d: any) => d.isActive).length}
                  </div>
                  <div className="text-gray-600 text-sm">Active Dentists</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-secondary-900">
                    {stats?.totalAppointments || appointments.length}
                  </div>
                  <div className="text-gray-600 text-sm">Total Appointments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Today's Appointments</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No appointments today</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Service</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Dentist</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {todayAppointments.map((appointment: any) => (
                          <tr key={appointment.id} className="hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <img
                                  src={appointment.user.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
                                  alt="Patient"
                                  className="w-8 h-8 rounded-full mr-3 object-cover"
                                />
                                <span className="font-medium">
                                  {appointment.user.firstName} {appointment.user.lastName}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{appointment.service.name}</td>
                            <td className="py-4 px-4 text-gray-600">{appointment.dentist.name}</td>
                            <td className="py-4 px-4 text-gray-600">{appointment.appointmentTime}</td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dentist Schedule Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Dentist Schedules</CardTitle>
                <Button className="bg-primary-500 hover:bg-primary-600" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dentists.map((dentist: any) => (
                    <div key={dentist.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <img
                          src={dentist.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face"}
                          alt={dentist.name}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <div className="font-medium text-secondary-900">{dentist.name}</div>
                          <div className="text-sm text-gray-600">{dentist.specialization}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Today:</span>
                          <span className="text-green-600 font-medium">Available</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Next Available:</span>
                          <span>2:00 PM</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                      >
                        Manage Schedule
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Dentist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Bulk Schedule Update
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-sm">
                    <p className="text-gray-900">New appointment booked</p>
                    <p className="text-gray-500">2 min ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-sm">
                    <p className="text-gray-900">Schedule updated</p>
                    <p className="text-gray-500">15 min ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="text-sm">
                    <p className="text-gray-900">Appointment cancelled</p>
                    <p className="text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
