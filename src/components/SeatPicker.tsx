
import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PassengerCount {
  adults: number;
  children: number;
  seniors: number;
}

interface SeatPickerProps {
  onChange: (count: PassengerCount) => void;
  initialCount?: PassengerCount;
}

const SeatPicker = ({ onChange, initialCount }: SeatPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState<PassengerCount>({
    adults: initialCount?.adults || 1,
    children: initialCount?.children || 0,
    seniors: initialCount?.seniors || 0,
  });

  const totalPassengers = counts.adults + counts.children + counts.seniors;

  useEffect(() => {
    onChange(counts);
  }, [counts, onChange]);

  const updateCount = (type: keyof PassengerCount, delta: number) => {
    setCounts(prev => {
      const newCount = Math.max(type === 'adults' ? 1 : 0, prev[type] + delta);
      return { ...prev, [type]: newCount };
    });
  };

  return (
    <div className="w-full space-y-2">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-full border border-gray-300 rounded-lg p-3 flex items-center justify-between"
      >
        <span className="text-base">{totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}</span>
        <svg
          className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-6 bg-white shadow-sm">
          {/* Adult row */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Adult</h3>
              <p className="text-gray-500 text-sm">18-59</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => updateCount('adults', -1)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-muted hover:text-muted-foreground"
                disabled={counts.adults <= 1}
              >
                <Minus className="h-4 w-4 text-gray-500" />
              </Button>
              
              <span className="text-xl w-8 text-center">{counts.adults}</span>
              
              <Button
                onClick={() => updateCount('adults', 1)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-primary/10 hover:border-primary"
              >
                <Plus className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>

          {/* Child row */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Child</h3>
              <p className="text-gray-500 text-sm">0-17</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => updateCount('children', -1)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-muted hover:text-muted-foreground"
                disabled={counts.children <= 0}
              >
                <Minus className="h-4 w-4 text-gray-500" />
              </Button>
              
              <span className="text-xl w-8 text-center">{counts.children}</span>
              
              <Button
                onClick={() => updateCount('children', 1)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-primary/10 hover:border-primary"
              >
                <Plus className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>

          {/* Senior row */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Senior</h3>
              <p className="text-gray-500 text-sm">60+</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => updateCount('seniors', -1)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-muted hover:text-muted-foreground"
                disabled={counts.seniors <= 0}
              >
                <Minus className="h-4 w-4 text-gray-500" />
              </Button>
              
              <span className="text-xl w-8 text-center">{counts.seniors}</span>
              
              <Button
                onClick={() => updateCount('seniors', 1)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-primary/10 hover:border-primary"
              >
                <Plus className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatPicker;
