
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookingSection from "@/components/BookingSection";
import Header from "@/components/Header";
import { Island } from "@/types/booking";

const BookingForm = () => {
  const location = useLocation();
  const preSelectedIsland = location.state?.island as Island | undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Header />
      <BookingSection preSelectedIsland={preSelectedIsland} />
    </div>
  );
};

export default BookingForm;
