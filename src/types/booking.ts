export interface Time {
  label: string;
  value: string;
}

export interface Passenger {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  country: string;
}

export interface ReturnTripDetails {
  from: string;
  island: string;
  time: Time | '';
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
  time: Time | '';
  date: Date;
  seats: number;
  returnTrip?: boolean;
  returnTripDetails?: ReturnTripDetails;
  passengers?: Passenger[];
  paymentComplete?: boolean;
  paymentReference?: string;
  id?: string;
  activity?: string;
  isActivityBooking?: boolean;
  // Add snake_case version for database compatibility
  is_activity_booking?: boolean;
}
