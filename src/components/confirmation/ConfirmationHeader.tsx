
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const ConfirmationHeader = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="flex items-center justify-center mb-6">
        <div className="bg-green-100 rounded-full p-3">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-ocean-dark text-center mb-6">
        {t("confirmation.title")}
      </h2>
    </>
  );
};

export default ConfirmationHeader;
