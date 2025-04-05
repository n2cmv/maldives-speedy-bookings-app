
import { useTranslation } from "react-i18next";
import SeatPicker from "../SeatPicker";
import { PassengerCount } from "@/types/booking";

interface PassengerSelectionProps {
  onChange: (passengerCounts: PassengerCount) => void;
  initialCount: PassengerCount;
  maxPassengers: number;
}

const PassengerSelection = ({
  onChange,
  initialCount,
  maxPassengers
}: PassengerSelectionProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("booking.form.passengers", "Number of Passengers")}
      </label>
      <SeatPicker 
        onChange={onChange}
        initialCount={initialCount}
      />
      <p className="text-xs text-gray-500 mt-1">
        {t("booking.form.maxPassengersInfo", "Maximum {{max}} seats per booking", {max: maxPassengers})}
      </p>
    </div>
  );
};

export default PassengerSelection;
