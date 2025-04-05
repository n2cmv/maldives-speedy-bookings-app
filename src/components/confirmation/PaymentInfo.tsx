
import { CreditCard } from "lucide-react";

interface PaymentInfoProps {
  paymentReference?: string;
}

const PaymentInfo = ({ paymentReference }: PaymentInfoProps) => {
  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
      <CreditCard className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
      <div>
        <p className="font-medium text-green-800">Payment Successful</p>
        <p className="text-sm text-green-700">
          Payment Reference: {paymentReference}
        </p>
      </div>
    </div>
  );
};

export default PaymentInfo;
