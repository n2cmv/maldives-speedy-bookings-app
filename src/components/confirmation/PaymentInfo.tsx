
import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaymentInfoProps {
  paymentReference?: string;
  booking?: any;
  totalAmount?: number;
  isActivityBooking?: boolean;
}

const PaymentInfo = ({ paymentReference, booking, totalAmount, isActivityBooking }: PaymentInfoProps) => {
  const { t } = useTranslation();
  
  // Use either direct reference or from booking object
  const reference = paymentReference || booking?.paymentReference;
  
  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
      <CreditCard className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
      <div>
        <p className="font-medium text-green-800">{t("confirmation.paymentSuccessful", "Payment Successful")}</p>
        <p className="text-sm text-green-700">
          {t("confirmation.reference", "Payment Reference")}: {reference}
        </p>
        {totalAmount !== undefined && (
          <p className="text-sm text-green-700 mt-1">
            {t("confirmation.amount", "Amount")}: ${totalAmount.toFixed(2)} USD
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentInfo;
