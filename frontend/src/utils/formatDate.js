/**
 * Formats a date string into a more readable format.
 * @param {string | Date} dateString - The date string or Date object to format.
 * @param {object} [options] - Optional formatting options for Intl.DateTimeFormat.
 * @returns {string} The formatted date string, or an empty string if the input is invalid.
 *
 * @example
 * formatDate("2025-09-04T12:00:00Z"); // "September 4, 2025"
 * formatDate(new Date(), { year: 'numeric', month: 'short', day: 'numeric' }); // "Sep 4, 2025"
 */
export const formatDate = (dateString, options) => {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC', // Assume database times are in UTC
    };

    // Use provided options or fall back to the default
    const formattingOptions = { ...defaultOptions, ...options };

    // 'en-IN' is used for locale to respect local formatting conventions if needed,
    // but the options provided will largely dictate the output.
    return new Intl.DateTimeFormat('en-IN', formattingOptions).format(date);

  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid Date'; // Return a fallback string on error
  }
};