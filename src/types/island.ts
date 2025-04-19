
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

// Type guard function to safely convert database island objects to our Island type
export function mapDatabaseIslandToIslandType(dbIsland: any): Island {
  return {
    id: dbIsland.id,
    name: dbIsland.name,
    description: dbIsland.description,
    image_url: dbIsland.image_url,
    tagline: dbIsland.tagline,
    slug: dbIsland.slug,
    fullDescription: dbIsland.full_description,
    heroImage: dbIsland.hero_image,
    galleryImages: Array.isArray(dbIsland.gallery_images) ? dbIsland.gallery_images : [],
    activities: Array.isArray(dbIsland.activities) ? dbIsland.activities.map((act: any) => ({
      name: act.name || '',
      description: act.description || '',
      image: act.image
    })) : [],
    accommodation: Array.isArray(dbIsland.accommodation) ? dbIsland.accommodation.map((acc: any) => ({
      type: acc.type || '',
      description: acc.description || '',
      priceRange: acc.priceRange
    })) : [],
    dining: Array.isArray(dbIsland.dining) ? dbIsland.dining.map((din: any) => ({
      type: din.type || '',
      description: din.description || ''
    })) : [],
    location: dbIsland.location ? {
      atoll: dbIsland.location.atoll || '',
      coordinates: dbIsland.location.coordinates
    } : undefined,
    travelInfo: dbIsland.travel_info ? {
      fromMale: dbIsland.travel_info.fromMale || '',
      bestWayToReach: dbIsland.travel_info.bestWayToReach || ''
    } : undefined,
    weather: dbIsland.weather ? {
      bestTime: dbIsland.weather.bestTime || '',
      temperature: dbIsland.weather.temperature || '',
      rainfall: dbIsland.weather.rainfall || ''
    } : undefined,
    essentialInfo: Array.isArray(dbIsland.essential_info) ? dbIsland.essential_info.map((info: any) => ({
      title: info.title || '',
      description: info.description || '',
      icon: info.icon
    })) : [],
    quickFacts: Array.isArray(dbIsland.quick_facts) ? dbIsland.quick_facts.map((fact: any) => ({
      label: fact.label || '',
      value: fact.value || '',
      icon: fact.icon || ''
    })) : [],
    faqs: Array.isArray(dbIsland.faqs) ? dbIsland.faqs.map((faq: any) => ({
      question: faq.question || '',
      answer: faq.answer || ''
    })) : [],
    created_at: dbIsland.created_at,
    updated_at: dbIsland.updated_at
  };
}
