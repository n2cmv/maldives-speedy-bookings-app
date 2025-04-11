
export interface RouteData {
  id: string;
  from_location: string;
  to_location: string;
  price: number;
  duration: number;
  timings?: string[];
  created_at: string;
  updated_at: string;
  display_order?: number;
  speedboat_name?: string | null;
  speedboat_image_url?: string | null;
  pickup_location?: string | null;
  pickup_map_url?: string | null;
}

export interface BookingData {
  id: string;
  user_email: string;
  from_location: string;
  to_location: string;
  departure_time: string;
  departure_date: string;
  return_trip: boolean;
  return_from_location?: string | null;
  return_to_location?: string | null;
  return_time?: string | null;
  return_date?: string | null;
  passenger_count: number;
  payment_complete: boolean;
  payment_reference?: string | null;
  passenger_info: any[];
  created_at: string;
  updated_at: string;
  activity?: string | null;
  is_activity_booking?: boolean;
}
