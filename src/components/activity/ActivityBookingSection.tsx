
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActivityBookingForm from "./ActivityBookingForm";
import TripSummaryCard from "@/components/TripSummaryCard";

interface ActivityBookingSectionProps {
  preSelectedActivity?: string;
}

const ActivityBookingSection = ({ preSelectedActivity }: ActivityBookingSectionProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([
    "Fishing", "Whale Sharks", "Sharks", "Manta Rays", "Turtles"
  ]);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleBookingSubmit = (bookingData: any) => {
    // Store booking data in session storage to persist through navigation
    sessionStorage.setItem("currentActivityBooking", JSON.stringify(bookingData));
    
    // Navigate to passenger details with booking data
    navigate("/activity-passenger-details", { state: bookingData });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <h1 className="text-3xl font-bold text-ocean-dark mb-8">
        Book Your Activity Experience
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityBookingForm 
            preSelectedActivity={preSelectedActivity} 
            activities={activities}
            isLoading={isLoading}
            onSubmit={handleBookingSubmit}
          />
        </div>
        
        <div>
          <TripSummaryCard 
            isActivityBooking={true}
            heading="Activity Summary"
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityBookingSection;
