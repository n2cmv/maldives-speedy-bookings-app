
export enum Time {
  AM_630 = "6:30 AM",
  AM_700 = "7:00 AM",
  AM_800 = "8:00 AM",
  AM_1000 = "10:00 AM",
  PM_1200 = "12:00 PM",
  PM_110 = "1:10 PM",
  PM_130 = "1:30 PM",
  PM_200 = "2:00 PM",
  PM_400 = "4:00 PM",
  PM_600 = "6:00 PM",
  PM_800 = "8:00 PM"
}

export interface Passenger {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  country: string;
  countryCode?: string;
  passport?: string;
}

export interface ReturnTripDetails {
  from: string;
  island: string;
  time: string | Time;
  date: Date;
}

export interface PassengerCount {
  adults: number;
  children: number;
  seniors: number;
}

export interface BookingInfo {
  from: string;
  island: string;
  time: string | Time;
  date: Date;
  seats: number;
  returnTrip?: boolean;
  returnTripDetails?: ReturnTripDetails;
  passengers?: Passenger[];
  passengerCounts?: PassengerCount;
  paymentComplete?: boolean;
  paymentReference?: string;
  id?: string;
  activity?: string;
  isActivityBooking?: boolean;
  // Add snake_case version for database compatibility
  is_activity_booking?: boolean;
}

// Add Island type for type safety
export type Island = string;
