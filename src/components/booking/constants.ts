
import { Time } from "@/types/booking";

export const MAX_PASSENGERS = 15;

export const fromLocations: string[] = [
  'Male\' City',
  'Male\' Airport'
];

export const allTimes: Time[] = [
  '8:00 AM', 
  '10:00 AM', 
  '12:00 PM', 
  '2:00 PM', 
  '4:00 PM', 
  '6:00 PM', 
  '8:00 PM'
];

export const islandTimeRestrictions: Record<string, Time[]> = {
  'A.Dh Dhigurah': ['6:30 AM', '1:10 PM'],
  'A.Dh Dhangethi': ['7:00 AM', '1:30 PM'],
  'Male': allTimes,
  'Hulhumale': allTimes,
  'Maafushi': allTimes,
  'Baa Atoll': allTimes,
  'Ari Atoll': allTimes,
  'Male\' City': allTimes,
  'Male\' Airport': allTimes,
  'Aa. Mathiveri': allTimes
};

export const fallbackIslands = [
  'Male', 
  'Hulhumale', 
  'Maafushi', 
  'Baa Atoll', 
  'Ari Atoll', 
  'Male\' City', 
  'Male\' Airport',
  'A.Dh Dhigurah',
  'A.Dh Dhangethi',
  'Aa. Mathiveri'
];
