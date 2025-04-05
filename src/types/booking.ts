
export type Island = string;

export type Time = 
  | '6:30 AM'
  | '7:00 AM'
  | '8:00 AM'
  | '10:00 AM' 
  | '11:00 AM'
  | '12:00 PM' 
  | '1:10 PM'
  | '1:30 PM'
  | '2:00 PM' 
  | '4:00 PM' 
  | '6:00 PM' 
  | '8:00 PM';

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
  id?: string; // For saved bookings
}

export interface SavedBooking extends BookingInfo {
  id: string;
}
