
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingInfo, Passenger } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import PassengerFormItem from "./PassengerFormItem";
import TripSummaryHeader from "./TripSummaryHeader";
import AddPassengerButton from "./AddPassengerButton";

interface PassengerFormProps {
  bookingInfo: BookingInfo;
  passengers: Passenger[];
  setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
}

const MAX_PASSENGERS = 15;

const PassengerForm = ({ 
  bookingInfo, 
  passengers, 
  setPassengers 
}: PassengerFormProps) => {
  const navigate = useNavigate();
  
  const handlePassengerChange = (id: number, field: keyof Passenger, value: string) => {
    setPassengers(prevPassengers => 
      prevPassengers.map(passenger => 
        passenger.id === id ? { ...passenger, [field]: value } : passenger
      )
    );
  };
  
  const handleRemovePassenger = (id: number) => {
    setPassengers(prevPassengers => prevPassengers.filter(passenger => passenger.id !== id));
  };
  
  const handleAddPassenger = () => {
    if (passengers.length >= MAX_PASSENGERS) {
      toast({
        title: "Maximum passengers reached",
        description: `You cannot add more than ${MAX_PASSENGERS} passengers.`,
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...passengers.map(p => p.id), 0) + 1;
    setPassengers(prevPassengers => [
      ...prevPassengers, 
      {
        id: newId,
        name: "",
        email: "",
        phone: "",
        countryCode: "+960", // Default to Maldives country code
        passport: "",
        type: "adult" // Default type
      }
    ]);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if first passenger has all required fields
    const firstPassenger = passengers[0];
    if (!firstPassenger?.name || !firstPassenger?.email || !firstPassenger?.phone || !firstPassenger?.passport) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for the primary passenger",
        variant: "destructive"
      });
      return;
    }
    
    // Check if all passengers have name and passport (only these are required for all)
    const missingRequiredInfo = passengers.some(p => !p.name || !p.passport);
    
    if (missingRequiredInfo) {
      toast({
        title: "Missing information",
        description: "Please fill in name and passport number for all passengers",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare updated booking info with passenger details
    const updatedBookingInfo = {
      ...bookingInfo,
      passengers
    };
    
    // Navigate to confirmation page with updated booking info
    navigate("/confirmation", { state: updatedBookingInfo });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TripSummaryHeader bookingInfo={bookingInfo} />
      
      {passengers.map((passenger, index) => (
        <PassengerFormItem
          key={passenger.id}
          passenger={passenger}
          index={index}
          isRemovable={index > 0}
          onRemove={handleRemovePassenger}
          onChange={handlePassengerChange}
        />
      ))}
      
      <AddPassengerButton 
        onAddPassenger={handleAddPassenger}
        passengerCount={passengers.length}
        maxPassengers={MAX_PASSENGERS}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-ocean hover:bg-ocean-dark text-white h-[60px] text-base font-medium"
      >
        Continue to Confirmation
      </Button>
    </form>
  );
};

export default PassengerForm;
