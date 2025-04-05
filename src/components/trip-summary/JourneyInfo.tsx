
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface JourneyInfoProps {
  from: string;
  to: string;
  time: string;
  date?: string | Date;
  isReturn?: boolean;
  isReturnTrip?: boolean;
}

const JourneyInfo = ({ from, to, time, date, isReturn = false, isReturnTrip = false }: JourneyInfoProps) => {
  const formattedDate = date ? (typeof date === 'string' ? date : format(new Date(date), 'MMM d, yyyy')) : '';
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-bold text-ocean">
          {from || 'Departure'} to {to}
        </h3>
        {isReturnTrip && (
          <span className={`ml-2 text-xs ${isReturn ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} px-2 py-0.5 rounded-full`}>
            {isReturn ? 'Return' : 'Outbound'}
          </span>
        )}
      </div>
      <p className="text-gray-600">By Speedboat</p>
      <div className="text-sm text-gray-500 mt-2 space-y-0.5">
        <p>{time} {formattedDate && `• ${formattedDate}`}</p>
        {!isReturnTrip && !isReturn && <p>One Way</p>}
      </div>
    </div>
  );
};

export default JourneyInfo;
