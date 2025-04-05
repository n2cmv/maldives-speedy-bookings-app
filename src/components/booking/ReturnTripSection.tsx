
import { useTranslation } from "react-i18next";
import TripDateTimeSelector from "./TripDateTimeSelector";
import { Time } from "@/types/booking";

interface ReturnTripSectionProps {
  returnTime: string;
  availableTimes: Time[];
  returnDate: Date | undefined;
  minDate?: Date;
  returnDateOpen: boolean;
  setReturnDateOpen: (open: boolean) => void;
  onReturnDateSelect: (date: Date | undefined) => void;
  onReturnTimeChange: (time: Time) => void;
}

const ReturnTripSection = ({
  returnTime,
  availableTimes,
  returnDate,
  minDate,
  returnDateOpen,
  setReturnDateOpen,
  onReturnDateSelect,
  onReturnTimeChange
}: ReturnTripSectionProps) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="font-medium text-ocean-dark mb-4">
          {t("booking.summary.returnJourney", "Return Journey")}
        </h3>
      </div>
      
      <TripDateTimeSelector
        label={t("booking.form.return", "Return")}
        date={returnDate}
        time={returnTime}
        availableTimes={availableTimes}
        minDate={minDate}
        isDateOpen={returnDateOpen}
        setIsDateOpen={setReturnDateOpen}
        onDateSelect={onReturnDateSelect}
        onTimeChange={onReturnTimeChange}
        id="return-time-select"
      />
    </>
  );
};

export default ReturnTripSection;
