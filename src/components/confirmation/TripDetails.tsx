
import { MapPin, Clock, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { TripDetails as TripDetailsType, BookingInfo } from "@/types/booking";
import { useTranslation } from "react-i18next";
import SpeedboatInfo from "./SpeedboatInfo";
import { RouteData } from "@/types/database";

export interface TripDetailsProps {
  title: string;
  from: string;
  to: string;
  time: string;
  date?: Date;
  isOutbound?: boolean;
  isReturn?: boolean;
  speedboatName?: string | null;
  speedboatImageUrl?: string | null;
  pickupLocation?: string | null;
  pickupMapUrl?: string | null;
  booking?: BookingInfo;
  outboundSpeedboatDetails?: RouteData;
  returnSpeedboatDetails?: RouteData;
}

const TripDetails = ({ 
  title, 
  from, 
  to, 
  time, 
  date, 
  isOutbound, 
  isReturn,
  speedboatName,
  speedboatImageUrl,
  pickupLocation,
  pickupMapUrl 
}: TripDetailsProps) => {
  const { t } = useTranslation();
  const formattedDate = date ? format(new Date(date), 'PPPP') : '';
  
  return (
    <div className="border-t border-gray-100 pt-4">
      <h3 className="font-medium mb-4 flex items-center">
        {isOutbound && <ArrowRight className="h-4 w-4 mr-1.5 text-blue-500" />}
        {isReturn && <ArrowLeft className="h-4 w-4 mr-1.5 text-green-500" />}
        {title}
      </h3>
      
      <div className="flex items-start">
        <MapPin className="h-5 w-5 text-ocean mr-3 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">{t("booking.summary.from", "From")}</p>
          <p className="font-medium text-gray-900">{from}</p>
        </div>
      </div>
      
      <div className="flex items-start mt-3">
        <MapPin className="h-5 w-5 text-ocean mr-3 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">{t("booking.summary.to", "To")}</p>
          <p className="font-medium text-gray-900">{to}</p>
        </div>
      </div>
      
      {formattedDate && (
        <div className="flex items-start mt-3">
          <Calendar className="h-5 w-5 text-ocean mr-3 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">{t("booking.summary.date", "Date")}</p>
            <p className="font-medium text-gray-900">{formattedDate}</p>
          </div>
        </div>
      )}
      
      <div className="flex items-start mt-3">
        <Clock className="h-5 w-5 text-ocean mr-3 mt-0.5" />
        <div>
          <p className="text-sm text-gray-500">{isReturn ? t("booking.form.returnTime", "Return Time") : t("booking.form.departureTime", "Departure Time")}</p>
          <p className="font-medium text-gray-900">{time}</p>
        </div>
      </div>

      {(speedboatName || pickupLocation) && (
        <SpeedboatInfo
          speedboatName={speedboatName}
          speedboatImageUrl={speedboatImageUrl}
          pickupLocation={pickupLocation}
          pickupMapUrl={pickupMapUrl}
          isReturn={isReturn}
        />
      )}
    </div>
  );
};

export default TripDetails;
