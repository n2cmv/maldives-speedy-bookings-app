
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface ReturnTripSwitchProps {
  isReturnTrip: boolean;
  onReturnTripChange: (checked: boolean) => void;
}

const ReturnTripSwitch = ({
  isReturnTrip,
  onReturnTripChange
}: ReturnTripSwitchProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="return-trip" className="text-sm font-medium text-gray-700">
        {t("booking.form.returnTrip", "Return Trip")}
      </Label>
      <Switch
        id="return-trip"
        checked={isReturnTrip}
        onCheckedChange={onReturnTripChange}
      />
    </div>
  );
};

export default ReturnTripSwitch;
