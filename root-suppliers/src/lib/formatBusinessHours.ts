/**
 * Format business hours from settings array.
 * Groups consecutive days with the same hours.
 * Returns an array of formatted strings (e.g. ["Mon - Fri: 9:00 AM - 5:00 PM", "Sat: Closed"])
 */
export const formatBusinessHours = (businessHours: { day: string; hours: string }[] | undefined): string[] => {
  if (!businessHours?.length) {
    return ["Sun - Fri: 9:00 AM - 7:00 PM", "Saturday: 10:00 AM - 5:00 PM"];
  }

  // Ensure sorting order: Sunday (0) to Saturday (6)
  // Our settings have day strings like "monday", "tuesday", etc.
  const dayOrder = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  // Sort and Normalize
  const sortedHours = [...businessHours].sort((a, b) => {
    return dayOrder.indexOf(a.day.toLowerCase()) - dayOrder.indexOf(b.day.toLowerCase());
  });

  const groups: { startDay: string; endDay: string; hours: string }[] = [];

  for (const item of sortedHours) {
    const day = item.day.charAt(0).toUpperCase() + item.day.slice(1, 3); // "Sun", "Mon"
    const hours = item.hours || "Closed";

    if (groups.length > 0) {
      const lastGroup = groups[groups.length - 1];
      // Check if consecutive in our order AND same hours
      // We are iterating in sorted order so just checking same hours is mostly enough 
      // but conceptually checks continuity.
      if (lastGroup.hours === hours) {
        lastGroup.endDay = day;
        continue;
      }
    }

    // Start new group
    groups.push({ startDay: day, endDay: day, hours });
  }

  // Format groups
  return groups.map(g => {
    if (g.startDay === g.endDay) {
      return `${g.startDay}: ${g.hours}`;
    }
    return `${g.startDay} - ${g.endDay}: ${g.hours}`;
  });
};
