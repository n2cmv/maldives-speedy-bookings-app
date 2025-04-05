
import React, { useState, useEffect } from 'react';
import { Minus, Plus, ChevronDown } from 'lucide-react';
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

  const updateCount = (type: keyof PassengerCount, delta: number, e: React.MouseEvent) => {
    // Prevent event propagation to stop form submission
    e.preventDefault();
    e.stopPropagation();
    
    setCounts(prev => {
      const newCount = Math.max(type === 'adults' ? 1 : 0, prev[type] + delta);
      return { ...prev, [type]: newCount };
    });
  };

  return (
    <div className="w-full space-y-2">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="passenger-picker"
      >
        <span className="text-base">{totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}</span>
        <ChevronDown
          className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-6 bg-white shadow-lg">
          {/* Adult row */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Adult</h3>
              <p className="text-gray-500 text-sm">18-59</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={(e) => updateCount('adults', -1, e)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-white hover:text-primary hover:border-primary"
                disabled={counts.adults <= 1}
                type="button" // Explicitly set type to button
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="text-xl w-8 text-center">{counts.adults}</span>
              
              <Button
                onClick={(e) => updateCount('adults', 1, e)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-white hover:text-primary hover:border-primary"
                type="button" // Explicitly set type to button
              >
                <Plus className="h-4 w-4" />
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
                onClick={(e) => updateCount('children', -1, e)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-white hover:text-primary hover:border-primary"
                disabled={counts.children <= 0}
                type="button" // Explicitly set type to button
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="text-xl w-8 text-center">{counts.children}</span>
              
              <Button
                onClick={(e) => updateCount('children', 1, e)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-white hover:text-primary hover:border-primary"
                type="button" // Explicitly set type to button
              >
                <Plus className="h-4 w-4" />
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
                onClick={(e) => updateCount('seniors', -1, e)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-white hover:text-primary hover:border-primary"
                disabled={counts.seniors <= 0}
                type="button" // Explicitly set type to button
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="text-xl w-8 text-center">{counts.seniors}</span>
              
              <Button
                onClick={(e) => updateCount('seniors', 1, e)}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-white hover:text-primary hover:border-primary"
                type="button" // Explicitly set type to button
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatPicker;
