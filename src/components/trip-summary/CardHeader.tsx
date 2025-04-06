
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const TripSummaryCardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader className="bg-ocean-light/10 border-b border-ocean-light/20">
        <CardTitle className="text-xl font-bold text-ocean-dark">Booking Summary</CardTitle>
        <div className="w-20 h-1 bg-ocean mt-2"></div>
      </CardHeader>
    </motion.div>
  );
};

export default TripSummaryCardHeader;
