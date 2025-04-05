
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const JourneySeparator = () => {
  return (
    <motion.div 
      className="flex items-center justify-center my-3"
      initial={{ opacity: 0, scaleX: 0.5 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full border-t border-dashed border-ocean-light/30"></div>
      <ArrowRight className="mx-2 text-ocean-light" />
      <div className="w-full border-t border-dashed border-ocean-light/30"></div>
    </motion.div>
  );
};

export default JourneySeparator;
