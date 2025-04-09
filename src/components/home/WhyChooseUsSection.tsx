
import { Ship, MapPin, Calendar } from "lucide-react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center">
    <div className="w-16 h-16 bg-[#0AB3B8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">{title}</h3>
    <p className="text-[#86868B]">{description}</p>
  </div>
);

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: <Ship className="h-8 w-8 text-[#0AB3B8]" />,
      title: "Premium Fleet",
      description: "Modern, well-maintained speedboats with comfortable seating and safety features."
    },
    {
      icon: <MapPin className="h-8 w-8 text-[#0AB3B8]" />,
      title: "Full Coverage",
      description: "Service to all major islands and resorts throughout the Maldives archipelago."
    },
    {
      icon: <Calendar className="h-8 w-8 text-[#0AB3B8]" />,
      title: "Flexible Scheduling",
      description: "Daily departures with convenient timing options to fit your travel plans."
    }
  ];

  return (
    <div className="py-16">
      <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-12 text-center">Why Choose Us</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUsSection;
