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

// IslandDetails type is the same as Island type
export type IslandDetails = Island;

// Type guard function to safely convert database island objects to our Island type
export function mapDatabaseIslandToIslandType(dbIsland: any): Island {
  return {
    id: dbIsland.id,
    name: dbIsland.name,
    description: dbIsland.description || "Beautiful island in the Maldives", // Ensure description is always present
    image_url: dbIsland.image_url,
    tagline: dbIsland.tagline,
    slug: dbIsland.slug,
    fullDescription: dbIsland.full_description,
    heroImage: dbIsland.hero_image,
    galleryImages: Array.isArray(dbIsland.gallery_images) ? dbIsland.gallery_images : [],
    activities: Array.isArray(dbIsland.activities) ? dbIsland.activities.map((act: any) => ({
      name: typeof act === 'object' && act !== null ? act.name || '' : '',
      description: typeof act === 'object' && act !== null ? act.description || '' : '',
      image: typeof act === 'object' && act !== null ? act.image : undefined
    })) : [],
    accommodation: Array.isArray(dbIsland.accommodation) ? dbIsland.accommodation.map((acc: any) => ({
      type: typeof acc === 'object' && acc !== null ? acc.type || '' : '',
      description: typeof acc === 'object' && acc !== null ? acc.description || '' : '',
      priceRange: typeof acc === 'object' && acc !== null ? acc.priceRange : undefined
    })) : [],
    dining: Array.isArray(dbIsland.dining) ? dbIsland.dining.map((din: any) => ({
      type: typeof din === 'object' && din !== null ? din.type || '' : '',
      description: typeof din === 'object' && din !== null ? din.description || '' : ''
    })) : [],
    location: typeof dbIsland.location === 'object' && dbIsland.location !== null ? {
      atoll: dbIsland.location.atoll || '',
      coordinates: dbIsland.location.coordinates
    } : undefined,
    travelInfo: typeof dbIsland.travel_info === 'object' && dbIsland.travel_info !== null ? {
      fromMale: dbIsland.travel_info.fromMale || '',
      bestWayToReach: dbIsland.travel_info.bestWayToReach || ''
    } : undefined,
    weather: typeof dbIsland.weather === 'object' && dbIsland.weather !== null ? {
      bestTime: dbIsland.weather.bestTime || '',
      temperature: dbIsland.weather.temperature || '',
      rainfall: dbIsland.weather.rainfall || ''
    } : undefined,
    essentialInfo: Array.isArray(dbIsland.essential_info) ? dbIsland.essential_info.map((info: any) => ({
      title: typeof info === 'object' && info !== null ? info.title || '' : '',
      description: typeof info === 'object' && info !== null ? info.description || '' : '',
      icon: typeof info === 'object' && info !== null ? info.icon : undefined
    })) : [],
    quickFacts: Array.isArray(dbIsland.quick_facts) ? dbIsland.quick_facts.map((fact: any) => ({
      label: typeof fact === 'object' && fact !== null ? fact.label || '' : '',
      value: typeof fact === 'object' && fact !== null ? fact.value || '' : '',
      icon: typeof fact === 'object' && fact !== null ? fact.icon || '' : ''
    })) : [],
    faqs: Array.isArray(dbIsland.faqs) ? dbIsland.faqs.map((faq: any) => ({
      question: typeof faq === 'object' && faq !== null ? faq.question || '' : '',
      answer: typeof faq === 'object' && faq !== null ? faq.answer || '' : ''
    })) : [],
    created_at: dbIsland.created_at,
    updated_at: dbIsland.updated_at
  };
}
