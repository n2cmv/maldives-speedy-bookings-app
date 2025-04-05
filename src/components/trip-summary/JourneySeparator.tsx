
import React from 'react';
import { ArrowRight } from 'lucide-react';

const JourneySeparator = () => {
  return (
    <div className="flex items-center justify-center my-3">
      <div className="w-full border-t border-dashed border-ocean-light/30"></div>
      <ArrowRight className="mx-2 text-ocean-light" />
      <div className="w-full border-t border-dashed border-ocean-light/30"></div>
    </div>
  );
};

export default JourneySeparator;
