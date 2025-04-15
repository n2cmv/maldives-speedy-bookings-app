
export interface Island {
  id?: string;
  name: string;
  description: string;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

// For backward compatibility with existing components
export type IslandName = string;

export interface IslandDetails {
  name: string;
  slug: string;
  fullDescription: string;
  heroImage: string;
  galleryImages: string[];
  location: {
    atoll: string;
    coordinates?: string;
  };
  travelInfo: {
    fromMale: string;
    bestWayToReach: string;
  };
  activities: Array<{
    name: string;
    description: string;
    image?: string;
  }>;
  accommodation: Array<{
    type: string;
    description: string;
    priceRange?: string;
  }>;
  dining: Array<{
    type: string;
    description: string;
  }>;
  weather: {
    bestTime: string;
    temperature: string;
    rainfall: string;
  };
  essentialInfo: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}
