import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoginButton from "@/components/auth/login-button";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StepIndicator from "@/components/booking/step-indicator";
import ServiceSelection from "@/components/booking/service-selection";
import DentistSelection from "@/components/booking/dentist-selection";
import DateTimeSelection from "@/components/booking/date-time-selection";
import Confirmation from "@/components/booking/confirmation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useLocation } from "wouter";

interface BookingData {
  serviceId: string;
  dentistId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  serviceName: string;
  servicePrice: string;
  serviceDuration: number;
  serviceDescription: string;
  dentistName: string,
  dentistPhone: string,
  dentistSpecialization: string
}

export default function Booking() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: "",
    dentistId: "",
    appointmentDate: "",
    appointmentTime: "",
    serviceName: "",
    servicePrice: "",
    serviceDuration: 0,
    serviceDescription: "",
    dentistName: "",
    dentistPhone: "",
    dentistSpecialization: ""

  });
  //console.log(user)
  const createAppointmentMutation = useMutation({
    mutationFn: async (data: BookingData) => {
      if (!user?.id) throw new Error("User not authenticated");
      const { createAppointment } = await import("@/lib/firestore");
      return await createAppointment({
        ...data,
        userId: user.id,
        userFirstname: user.firstName,
        userEmail: user.email,
        userPhone: user.phone || '',
        status: "scheduled",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your appointment has been booked successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
              <p className="text-gray-600 mb-6">You need to be logged in to book an appointment.</p>
              <LoginButton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!bookingData.serviceId || !bookingData.dentistId) {
          toast({
            title: "Incomplete Selection",
            description: "Please select both a service and a dentist.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!bookingData.appointmentDate || !bookingData.appointmentTime) {
          toast({
            title: "Incomplete Selection",
            description: "Please select both a date and time.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleConfirm = () => {
    createAppointmentMutation.mutate(bookingData);
  };

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };
  const [selectedDentistId, setSelectedDentistId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  //const [selectedDentistDetails, setSelectedDentistDetails] = useState<any>(null);
  const handleDentistSelect = (dentist: any) => {
    console.log(dentist)
    setSelectedDentistId(dentist.id);
    updateBookingData({ dentistId:dentist.id })
    updateBookingData({ dentistName:dentist.name })
    updateBookingData({ dentistPhone:dentist.phone })
    updateBookingData({ dentistSpecialization:dentist.specialization })
  };
  const handleServiceSelect = (service: any) => {
    setSelectedServiceId(service.id);
    updateBookingData({ serviceId:service.id })
    updateBookingData({ serviceName:service.name })
    updateBookingData({ servicePrice:service.price })
    updateBookingData({ serviceDuration:service.duration })
    updateBookingData({ serviceDescription:service.description })
  };
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600">Choose your preferred service, dentist, date, and time</p>
        </div>

        <Card className="shadow-lg border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <StepIndicator currentStep={currentStep} />
          </div>

          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="grid lg:grid-cols-2 gap-8">
                <ServiceSelection
                  selectedServiceId={selectedServiceId}
                  onServiceSelect={handleServiceSelect}
                />
                <DentistSelection
                  selectedDentistId={selectedDentistId}
                  onDentistSelect={handleDentistSelect}
                />
              </div>
            )}

            {currentStep === 2 && (
              <DateTimeSelection
                selectedDate={bookingData.appointmentDate}
                selectedTime={bookingData.appointmentTime}
                dentistId={bookingData.dentistId}
                onDateSelect={(date) => updateBookingData({ appointmentDate: date })}
                onTimeSelect={(time) => updateBookingData({ appointmentTime: time })}
              />
            )}

            {currentStep === 3 && (
              <Confirmation
                bookingData={bookingData}
                onNotesChange={(notes) => updateBookingData({ notes })}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={currentStep === 1 ? "invisible" : ""}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleConfirm}
                  disabled={createAppointmentMutation.isPending}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {createAppointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
