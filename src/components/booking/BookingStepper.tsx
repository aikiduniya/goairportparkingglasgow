import { Check } from "lucide-react";

interface BookingStepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Dates" },
  { number: 2, label: "Select" },
  { number: 3, label: "Profile" },
  { number: 4, label: "Confirm" },
];

const BookingStepper = ({ currentStep }: BookingStepperProps) => {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2 md:gap-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-colors ${
                  step.number < currentStep
                    ? "bg-accent text-accent-foreground"
                    : step.number === currentStep
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary-foreground/20 text-primary-foreground/60"
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-1 text-xs md:text-sm font-medium ${
                  step.number <= currentStep
                    ? "text-primary-foreground"
                    : "text-primary-foreground/60"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-8 md:w-16 h-0.5 mx-1 md:mx-2 ${
                  step.number < currentStep
                    ? "bg-accent"
                    : "bg-primary-foreground/20"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStepper;
