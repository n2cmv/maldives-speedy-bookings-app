
import React from "react";
import { ArrowRight, MapPin, Ship } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BookingInfo } from "@/types/booking";
import { RouteData } from "@/types/database";

export interface SpeedboatInfoProps {
  speedboatName: string | null;
  speedboatImageUrl: string | null;
  pickupLocation: string | null;
  pickupMapUrl: string | null;
  isReturn?: boolean;
  outboundSpeedboatDetails?: RouteData;
  returnSpeedboatDetails?: RouteData;
  bookingInfo?: BookingInfo;
}

const SpeedboatInfo: React.FC<SpeedboatInfoProps> = ({
  speedboatName,
  speedboatImageUrl,
  pickupLocation,
  pickupMapUrl,
  isReturn = false,
}) => {
  const { t } = useTranslation();

  if (!speedboatName && !pickupLocation) return null;

  return (
    <div className="border-t border-gray-100 pt-4 mt-2">
      <h3 className="font-medium mb-3 flex items-center">
        {isReturn ? (
          <ArrowRight className="h-4 w-4 mr-1.5 text-green-500 rotate-180" />
        ) : (
          <ArrowRight className="h-4 w-4 mr-1.5 text-blue-500" />
        )}
        {t("confirmation.speedboatDetails", "Speedboat Details")}
      </h3>

      <div className="bg-blue-50 rounded-md p-3">
        {speedboatName && (
          <div className="flex items-start mb-2">
            <Ship className="h-5 w-5 text-ocean mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">{t("confirmation.vessel", "Vessel")}</p>
              <p className="font-medium text-gray-900">{speedboatName}</p>
            </div>
          </div>
        )}

        {pickupLocation && (
          <div className="flex items-start mt-2">
            <MapPin className="h-5 w-5 text-ocean mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">{t("confirmation.pickupPoint", "Pickup Point")}</p>
              <p className="font-medium text-gray-900">{pickupLocation}</p>
              
              {pickupMapUrl && (
                <a 
                  href={pickupMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ocean hover:underline mt-1 inline-block"
                >
                  {t("confirmation.viewMap", "View on Map")} →
                </a>
              )}
            </div>
          </div>
        )}

        {speedboatImageUrl && (
          <div className="mt-3">
            <img 
              src={speedboatImageUrl} 
              alt={speedboatName || t("confirmation.speedboat", "Speedboat")}
              className="w-full h-32 object-cover rounded-md mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedboatInfo;
