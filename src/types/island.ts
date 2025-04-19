
export interface Island {
  id?: string;
  name: string;
  description: string;
  image_url?: string | null;
  tagline?: string;
  slug?: string;
  fullDescription?: string;
  heroImage?: string;
  galleryImages?: string[];
  activities?: Array<{
    name: string;
    description: string;
    image?: string;
  }>;
  accommodation?: Array<{
    type: string;
    description: string;
    priceRange?: string;
  }>;
  dining?: Array<{
    type: string;
    description: string;
  }>;
  location?: {
    atoll: string;
    coordinates?: string;
  };
  travelInfo?: {
    fromMale: string;
    bestWayToReach: string;
  };
  weather?: {
    bestTime: string;
    temperature: string;
    rainfall: string;
  };
  essentialInfo?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  quickFacts?: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  created_at?: string;
  updated_at?: string;
}
