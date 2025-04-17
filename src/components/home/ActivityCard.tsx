
import { useState, useRef } from "react";

type ActivityCardProps = {
  imageSrc: string;
  title: string;
  description: string;
  isFirst?: boolean;
};

const ActivityCard = ({
  imageSrc,
  title,
  description,
  isFirst = false
}: ActivityCardProps) => {
  const [transform, setTransform] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = -1 * ((y / rect.height - 0.5) * 5);
    const rotateY = (x / rect.width - 0.5) * 5;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };
  const handleMouseLeave = () => {
    setTransform('');
  };
  return (
    <div className="px-1"> 
      <div ref={cardRef} className="space-y-3 transition-all duration-200 ease-out transform-gpu max-w-[280px] mx-auto" style={{
      transform
    }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div className="overflow-hidden rounded-3xl h-72 shadow-md">
          <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-2xl font-semibold text-[#1D1D1F] mt-4">{title}</h3>
        <p className="text-[#505056] leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ActivityCard;
