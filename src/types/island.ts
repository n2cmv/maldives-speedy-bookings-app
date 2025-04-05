
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
