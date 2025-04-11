
export type Island = string;

export enum Time {
  AM_630 = '6:30 AM',
  AM_700 = '7:00 AM',
  AM_800 = '8:00 AM',
  AM_1000 = '10:00 AM',
  AM_1100 = '11:00 AM',
  PM_1200 = '12:00 PM',
  PM_110 = '1:10 PM',
  PM_130 = '1:30 PM',
  PM_200 = '2:00 PM',
  PM_400 = '4:00 PM',
  PM_600 = '6:00 PM',
  PM_800 = '8:00 PM'
}

export interface PassengerCount {
  adults: number;
  children: number;
  seniors: number;
}

export interface Passenger {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  passport: string;
  type: 'adult' | 'child' | 'senior';
}

export interface TripDetails {
  from: Island | '';
  island: Island | '';
  time: Time | string;
  date?: Date | string;
}

export interface BookingInfo {
  from: Island | '';
  island: Island | '';
  time: Time | string;
  seats: number;
  date?: Date | string;
  passengerCounts?: PassengerCount;
  passengers?: Passenger[];
  returnTrip?: boolean;
  returnTripDetails?: TripDetails;
  paymentComplete?: boolean;
  paymentReference?: string;
  id?: string; // For saved bookings
  activity?: string; // For activity bookings
  isActivityBooking?: boolean; // Flag to identify activity bookings
  activityDate?: Date | string; // Activity date (if different from trip date)
  activityTime?: string; // Activity time (if different from trip time)
  activityLocation?: string; // Activity location
  activityDetails?: string; // Additional activity details
  activityImage?: string; // URL to activity image
  activityPrice?: number; // Price for the activity
  bookingDate?: Date | string; // Date when booking was created
}

export interface SavedBooking extends BookingInfo {
  id: string;
}
