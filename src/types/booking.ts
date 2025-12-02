
export type Island = string;

export enum Time {
  AM_630 = '6:30 AM',
  AM_700 = '7:00 AM',
  AM_800 = '8:00 AM',
  AM_1000 = '10:00 AM',
  AM_1045 = '10:45 AM',
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
  id: number;
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
  time: Time | '';
  date?: Date;
}

export interface BookingInfo {
  from: Island | '';
  island: Island | '';
  time: Time | '';
  seats: number;
  date?: Date;
  passengerCounts?: PassengerCount;
  passengers?: Passenger[];
  returnTrip?: boolean;
  returnTripDetails?: TripDetails;
  paymentComplete?: boolean;
  paymentReference?: string;
  paymentMethod?: string; // Added paymentMethod property
  id?: string; // For saved bookings
}

export interface SavedBooking extends BookingInfo {
  id: string;
}
