
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type BookingStepProps = {
  number: number;
  title: string;
  description: string;
};

const BookingStep = ({ number, title, description }: BookingStepProps) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm relative">
    <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0AB3B8] text-white rounded-full flex items-center justify-center font-medium">{number}</div>
    <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">{title}</h3>
    <p className="text-[#86868B]">{description}</p>
  </div>
);

const HowToBookSection = () => {
  const steps = [
    {
      number: 1,
      title: "Select Your Route",
      description: "Choose your departure and destination islands from our network."
    },
    {
      number: 2,
      title: "Book Your Journey",
      description: "Select date, time, and number of passengers for your trip."
    },
    {
      number: 3,
      title: "Instant Online Payment",
      description: "Get instant ticket and confirmation when payment is done."
    }
  ];

  return (
    <div className="py-16">
      <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-12 text-center">How to book a Speedboat?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <BookingStep 
            key={step.number}
            number={step.number}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-12">
        <Link to="/booking" className="inline-flex items-center bg-[#0AB3B8] hover:bg-[#0055B0] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300">
          Start Booking Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default HowToBookSection;
