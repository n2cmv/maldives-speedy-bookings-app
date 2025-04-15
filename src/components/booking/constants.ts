
import { Time } from "@/types/booking";

export const MAX_PASSENGERS = 15;

export const fromLocations: string[] = [
  'Male\' City',
  'Male\' Airport'
];

export const allTimes: Time[] = [
  Time.AM_800,
  Time.AM_1000, 
  Time.PM_1200, 
  Time.PM_200, 
  Time.PM_400, 
  Time.PM_600, 
  Time.PM_800
];

export const islandTimeRestrictions: Record<string, Time[]> = {
  'A.Dh Dhigurah': [Time.AM_630, Time.PM_110],
  'A.Dh Dhangethi': [Time.AM_700, Time.PM_130],
  'Male': allTimes,
  'Hulhumale': allTimes,
  'Baa Atoll': allTimes,
  'Ari Atoll': allTimes,
  'Male\' City': allTimes,
  'Male\' Airport': allTimes
};

export const fallbackIslands = [
  'Male', 
  'Hulhumale', 
  'Baa Atoll', 
  'Ari Atoll', 
  'Male\' City', 
  'Male\' Airport',
  'A.Dh Dhigurah',
  'A.Dh Dhangethi'
];
