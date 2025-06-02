/**
 * Utility functions for date operations
 */

/**
 * Gets the number of days in a given month and year
 * @param month - Month (1-12)
 * @param year - Year (e.g. 2025)
 * @returns Number of days in the month
 */
export const getDaysInMonth = (month: number, year: number): number => {
  // Month is 0-based for Date constructor
  return new Date(year, month, 0).getDate();
};

/**
 * Calculates age based on birthdate
 * @param birthDate - Date object representing birthdate
 * @returns Age in years
 */
export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  // If birth month is after current month or same month but birth day is after today
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Checks if a person is of minimum age
 * @param birthDate - Date object representing birthdate
 * @param minAge - Minimum age required
 * @returns Boolean indicating if person meets minimum age
 */
export const isMinimumAge = (birthDate: Date, minAge: number): boolean => {
  const age = calculateAge(birthDate);
  return age >= minAge;
};

/**
 * Formats date as locale string
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};