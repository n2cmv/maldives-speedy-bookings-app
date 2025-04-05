
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const TripSummaryCardHeader = () => {
  return (
    <CardHeader className="bg-ocean-light/10 border-b border-ocean-light/20">
      <CardTitle className="text-xl font-bold text-ocean-dark">Booking Summary</CardTitle>
      <div className="w-20 h-1 bg-ocean mt-2"></div>
    </CardHeader>
  );
};

export default TripSummaryCardHeader;
