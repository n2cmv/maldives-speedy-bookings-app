
export type Island = 
  | 'Male' 
  | 'Hulhumale' 
  | 'Maafushi' 
  | 'Baa Atoll'
  | 'Ari Atoll'
  | 'A.Dh Dhigurah'
  | 'A.Dh Dhangethi'
  | 'Aa. Mathiveri';

export type Time = 
  | '8:00 AM'
  | '10:00 AM' 
  | '12:00 PM' 
  | '2:00 PM' 
  | '4:00 PM' 
  | '6:00 PM' 
  | '8:00 PM';

export interface BookingInfo {
  island: Island | '';
  time: Time | '';
  seats: number;
}
