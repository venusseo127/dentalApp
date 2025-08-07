interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: "Select Service & Dentist" },
    { number: 2, title: "Choose Date & Time" },
    { number: 3, title: "Confirm Booking" }
  ];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step.number <= currentStep 
                ? "bg-primary-500 text-white" 
                : "bg-gray-300 text-gray-600"
            }`}>
              {step.number}
            </div>
            <span className={`ml-3 font-medium transition-colors ${
              step.number <= currentStep 
                ? "text-secondary-900" 
                : "text-gray-500"
            }`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="mx-8 flex-1 h-px bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
}
