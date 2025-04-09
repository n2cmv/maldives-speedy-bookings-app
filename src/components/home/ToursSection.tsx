
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Define a type for activity card props
type ActivityCardProps = {
  imageSrc: string;
  title: string;
  description: string;
  price: string;
};

const ActivityCard = ({ imageSrc, title, description, price }: ActivityCardProps) => (
  <div className="space-y-4">
    <div className="overflow-hidden rounded-2xl h-64">
      <img 
        src={imageSrc} 
        alt={title} 
        className="w-full h-full object-cover"
      />
    </div>
    <h3 className="text-xl font-semibold text-[#1D1D1F]">{title}</h3>
    <p className="text-[#505056]">{description}</p>
    <p className="font-medium text-[#0AB3B8]">{price}</p>
  </div>
);

const ToursSection = () => {
  const activities = [
    {
      imageSrc: "https://images.unsplash.com/photo-1513316564811-ee3c49558c8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Manta Ray Experience",
      description: "Get up close with these majestic creatures in their natural habitat.",
      price: "$70 per person"
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
      title: "Whale Shark Adventure",
      description: "Encounter gentle whale sharks in Maldives' Baa and Ari Atolls year-round.",
      price: "$80 per person"
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Shark Encounters",
      description: "Spot various sharks in Maldives—from docile nurse to thrilling tiger sharks.",
      price: "$50 per person"
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",
      title: "Sunset Fishing",
      description: "Cast your lines from island piers or venture out to the sea for fishing.",
      price: "$55 per person"
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Sand Bank Escape",
      description: "Visit a secluded sandbank for a private beach day away from everyone.",
      price: "$120 per trip"
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      title: "Resort Day Trip",
      description: "Enjoy a full day of luxury amenities at one of our partner resorts.",
      price: "$75 per person"
    }
  ];

  return (
    <div className="py-16 px-4">
      <div className="bg-[#F8FCFA] rounded-3xl p-8 md:p-16">
        <div className="mb-10">
          <span className="uppercase text-sm font-medium tracking-wider text-[#0AB3B8]">EXCURSIONS</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] mt-2 mb-6">Beyond the Island</h2>
          <p className="text-[#505056] max-w-md text-lg">
            Explore marine life up close like never before.
            Set off from your island for a true secluded
            experience in the heart of the sea.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {activities.map((activity, index) => (
            <ActivityCard 
              key={index}
              imageSrc={activity.imageSrc}
              title={activity.title}
              description={activity.description}
              price={activity.price}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Link to="/booking" className="inline-flex items-center bg-[#0AB3B8] hover:bg-[#0055B0] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300">
            Book an Activity
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToursSection;
