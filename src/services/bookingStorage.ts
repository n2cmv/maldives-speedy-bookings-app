
import { BookingInfo } from "@/types/booking";

const SAVED_BOOKINGS_KEY = "savedBookings";
const CURRENT_BOOKING_KEY = "currentBooking";

// Save current booking to local storage
export const saveBookingToSessionStorage = (booking: BookingInfo): void => {
  sessionStorage.setItem(CURRENT_BOOKING_KEY, JSON.stringify(booking));
};

// Get current booking from session storage
export const getCurrentBookingFromSessionStorage = (): BookingInfo | null => {
  const bookingStr = sessionStorage.getItem(CURRENT_BOOKING_KEY);
  return bookingStr ? JSON.parse(bookingStr) : null;
};

// Clear current booking from session storage
export const clearCurrentBookingFromSessionStorage = (): void => {
  sessionStorage.removeItem(CURRENT_BOOKING_KEY);
};

// Save a booking to local storage (for saved bookings feature)
export const saveBookingToLocalStorage = (booking: BookingInfo): void => {
  const savedBookings = getSavedBookingsFromLocalStorage();
  
  // Create a unique ID for the booking based on time if it doesn't have one
  const bookingToSave = {
    ...booking,
    id: booking.paymentReference || `booking_${Date.now()}`
  };
  
  // Replace existing booking or add new one
  const updatedBookings = savedBookings.some(b => b.paymentReference === booking.paymentReference)
    ? savedBookings.map(b => b.paymentReference === booking.paymentReference ? bookingToSave : b)
    : [...savedBookings, bookingToSave];
  
  localStorage.setItem(SAVED_BOOKINGS_KEY, JSON.stringify(updatedBookings));
};

// Get all saved bookings from local storage
export const getSavedBookingsFromLocalStorage = (): (BookingInfo & { id: string })[] => {
  const savedBookingsStr = localStorage.getItem(SAVED_BOOKINGS_KEY);
  return savedBookingsStr ? JSON.parse(savedBookingsStr) : [];
};

// Remove a booking from local storage
export const removeSavedBooking = (id: string): void => {
  const savedBookings = getSavedBookingsFromLocalStorage();
  const updatedBookings = savedBookings.filter(booking => booking.id !== id);
  localStorage.setItem(SAVED_BOOKINGS_KEY, JSON.stringify(updatedBookings));
};

// Load a saved booking into the current session
export const loadSavedBooking = (id: string): BookingInfo | null => {
  const savedBookings = getSavedBookingsFromLocalStorage();
  const bookingToLoad = savedBookings.find(booking => booking.id === id);
  
  if (bookingToLoad) {
    saveBookingToSessionStorage(bookingToLoad);
    return bookingToLoad;
  }
  
  return null;
};
