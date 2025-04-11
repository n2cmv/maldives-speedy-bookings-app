
import { CreditCard, Check, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BookingInfo } from "@/types/booking";

export interface PaymentInfoProps {
  paymentReference: string;
  booking?: BookingInfo;
  paymentMethod?: string;
  isSimulationMode?: boolean;
}

const PaymentInfo = ({ 
  paymentReference, 
  paymentMethod = "Bank of Maldives",
  isSimulationMode = false
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
        
        {isSimulationMode && (
          <div className="mt-2 flex items-center text-amber-700 bg-amber-50 p-2 rounded text-xs">
            <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>Simulated payment (for testing only)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentInfo;
