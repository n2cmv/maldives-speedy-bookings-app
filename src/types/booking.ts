
export enum Time {
  AM_630 = "6:30 AM",
  AM_700 = "7:00 AM",
  AM_800 = "8:00 AM",
  AM_1000 = "10:00 AM",
  AM_1100 = "11:00 AM",
  PM_110 = "1:10 PM",
  PM_130 = "1:30 PM",
  PM_1200 = "12:00 PM",
  PM_200 = "2:00 PM",
  PM_400 = "4:00 PM",
  PM_600 = "6:00 PM",
  PM_800 = "8:00 PM",
}

export type PassengerCount = {
  adults: number;
  children: number;
  seniors: number;
};

export type PassengerInfo = {
  name: string;
  email: string;
  phone: string;
  age?: number;
  nationality?: string;
  idNumber?: string;
  id: string | number;
  type?: 'adult' | 'child' | 'senior';
  passport?: string;
  countryCode?: string;
};

// Alias for backward compatibility
export type Passenger = PassengerInfo;

export interface BookingInfo {
  from: string;
  island: string;
  time: string;
  date?: Date;
  seats: number;
  passengerCounts?: PassengerCount;
  returnTrip: boolean;
  returnTripDetails?: {
    from: string;
    island: string;
    time: string;
    date?: Date;
  };
  id?: string;
  passengers?: PassengerInfo[];
  paymentComplete?: boolean;
  paymentReference?: string;
}

// For backward compatibility with components that expect this type
export type TripDetails = {
  from: string;
  to: string;
  time: string;
  date?: Date;
  isOutbound?: boolean;
  isReturn?: boolean;
}

export interface Island {
  id?: string;
  name: string;
  description: string;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}
