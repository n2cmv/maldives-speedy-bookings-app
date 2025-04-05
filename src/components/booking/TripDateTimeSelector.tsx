
import { useTranslation } from "react-i18next";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import { Time } from "@/types/booking";

interface TripDateTimeSelectorProps {
  label?: string;
  date: Date | undefined;
  time: string;
  availableTimes: Time[];
  minDate?: Date;
  isDateOpen: boolean;
  setIsDateOpen: (open: boolean) => void;
  onDateSelect: (date: Date | undefined) => void;
  onTimeChange: (time: Time) => void;
  id?: string;
}

const TripDateTimeSelector = ({
  label,
  date,
  time,
  availableTimes,
  minDate,
  isDateOpen,
  setIsDateOpen,
  onDateSelect,
  onTimeChange,
  id = "time-select"
}: TripDateTimeSelectorProps) => {
  const { t } = useTranslation();
  
  const dateLabel = label 
    ? `${label} ${t("booking.form.date", "Date")}` 
    : t("booking.form.departureDate", "Departure Date");
  
  const timeLabel = label 
    ? `${label} ${t("booking.form.time", "Time")}` 
    : t("booking.form.departureTime", "Departure Time");
  
  return (
    <>
      <DateSelector
        label={dateLabel}
        selectedDate={date}
        onDateSelect={onDateSelect}
        minDate={minDate}
        isOpen={isDateOpen}
        setIsOpen={setIsDateOpen}
      />
      
      <TimeSelector
        label={timeLabel}
        selectedTime={time}
        availableTimes={availableTimes}
        onTimeChange={onTimeChange}
        id={id}
      />
    </>
  );
};

export default TripDateTimeSelector;
