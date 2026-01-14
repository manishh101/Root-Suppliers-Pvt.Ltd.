/**
 * Format business hours from settings array.
 * Enforces the "Sun - Fri" and "Saturday" pattern.
 */
export const formatBusinessHours = (businessHours: { day: string; hours: string }[] | undefined) => {
  if (!businessHours?.length) {
    return { weekday: "Sun - Fri: 7AM - 7PM", saturday: "Saturday: 7AM - 5PM" };
  }

  // Try to format hours from settings
  // We use Monday's hours for the "Sun - Fri" block as per user request
  const monday = businessHours.find(h => h.day.toLowerCase() === 'monday');
  const saturday = businessHours.find(h => h.day.toLowerCase() === 'saturday');

  return {
    weekday: `Sun - Fri: ${monday?.hours || '7AM - 7PM'}`,
    saturday: `Saturday: ${saturday?.hours || '7AM - 5PM'}`
  };
};
