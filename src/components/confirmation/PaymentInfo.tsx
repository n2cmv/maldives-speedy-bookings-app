
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BookingInfo } from "@/types/booking";

export interface PaymentInfoProps {
  paymentReference: string;
  booking?: BookingInfo;
  paymentMethod?: string;
}

const PaymentInfo = ({ 
  paymentReference, 
  paymentMethod = "Bank Transfer"
}: PaymentInfoProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
      <div className="rounded-full bg-green-100 p-1.5 mr-3 flex-shrink-0">
        <Check className="h-4 w-4 text-green-600" />
      </div>
      <div>
        <p className="font-medium text-green-800">{t("confirmation.paymentSuccessful", "Payment Successful")}</p>
        <p className="text-sm text-green-700 mt-1">
          {t("confirmation.reference", "Payment Reference")}: <span className="font-medium">{paymentReference}</span>
        </p>
        <p className="text-sm text-green-700 mt-1">
          {t("confirmation.paymentMethod", "Payment Method")}: {paymentMethod}
        </p>
      </div>
    </div>
  );
};

export default PaymentInfo;
