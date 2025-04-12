
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  description: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethodSelector = ({ 
  selectedMethod, 
  onMethodChange 
}: PaymentMethodSelectorProps) => {
  // Available payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      logo: "/lovable-uploads/05a88421-85a4-4019-8124-9aea2cda32b4.png",
      description: "Pay securely via bank transfer"
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      logo: "/placeholder.svg",
      description: "Pay with your credit or debit card"
    }
    // More payment methods can be added here in the future
  ];

  return (
    <div>
      <h3 className="text-base font-medium mb-3">Select Payment Method</h3>
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={onMethodChange}
        className="space-y-3"
      >
        {paymentMethods.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer border transition-colors ${
              selectedMethod === method.id 
                ? 'border-ocean bg-ocean-light/10' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => onMethodChange(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <RadioGroupItem value={method.id} id={method.id} className="data-[state=checked]:border-ocean data-[state=checked]:bg-ocean" />
                
                <div className="flex items-center justify-between flex-1">
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </Label>
                  
                  <div className="flex-shrink-0 w-16">
                    <img 
                      src={method.logo} 
                      alt={method.name}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
