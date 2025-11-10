
import { Star } from "lucide-react";

type TestimonialCardProps = {
  rating: number;
  text: string;
  author: string;
};

const TestimonialCard = ({ rating, text, author }: TestimonialCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm">
    <div className="flex items-center mb-4">
      <div className="flex text-[#0AB3B8]">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
    </div>
    <p className="text-[#86868B] mb-4">{text}</p>
    <div className="font-medium text-[#1D1D1F]">{author}</div>
  </div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      rating: 5,
      text: "\"The speedboat service was excellent! Clean boats, punctual departures and friendly staff.\"",
      author: "- Sarah J."
    },
    {
      rating: 5,
      text: "\"Booking was simple and straightforward. The online system worked perfectly.\"",
      author: "- Michael T."
    },
    {
      rating: 5,
      text: "\"The captain was professional and the journey was smooth. Will definitely use Visit Dhigurah again!\"",
      author: "- Emma L."
    }
  ];

  return (
    <div className="py-16">
      <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-12 text-center">Customer Experiences</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={index}
            rating={testimonial.rating}
            text={testimonial.text}
            author={testimonial.author}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
