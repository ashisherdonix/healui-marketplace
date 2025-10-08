// Utility functions for handling Indian pincodes

/**
 * Extracts a valid 6-digit Indian pincode from a string
 * @param input - The input string to extract pincode from
 * @returns The extracted pincode or null if not found
 */
export function extractPincode(input: string): string | null {
  // Match 6 consecutive digits that form a word boundary
  const match = input.match(/\b\d{6}\b/);
  
  if (match) {
    const pincode = match[0];
    // Basic validation for Indian pincodes (should start with 1-9)
    if (pincode[0] !== '0') {
      return pincode;
    }
  }
  
  return null;
}

/**
 * Validates if a string is a valid Indian pincode
 * @param pincode - The pincode to validate
 * @returns true if valid, false otherwise
 */
export function isValidPincode(pincode: string): boolean {
  // Must be exactly 6 digits
  if (!/^\d{6}$/.test(pincode)) {
    return false;
  }
  
  // Indian pincodes don't start with 0 or 9
  const firstDigit = parseInt(pincode[0]);
  if (firstDigit === 0 || firstDigit === 9) {
    return false;
  }
  
  return true;
}

/**
 * Extracts multiple pincodes from a string
 * @param input - The input string to extract pincodes from
 * @returns Array of valid pincodes found
 */
export function extractAllPincodes(input: string): string[] {
  const matches = input.match(/\b\d{6}\b/g) || [];
  return matches.filter(pincode => isValidPincode(pincode));
}

/**
 * Formats location query by extracting pincode and other location info
 * @param query - The search query
 * @returns Object with pincode and remaining query
 */
export function parseLocationQuery(query: string): {
  pincode: string | null;
  remainingQuery: string;
} {
  const pincode = extractPincode(query);
  let remainingQuery = query;
  
  if (pincode) {
    // Remove the pincode from the query
    remainingQuery = query.replace(pincode, '').trim();
    // Clean up extra spaces
    remainingQuery = remainingQuery.replace(/\s+/g, ' ').trim();
  }
  
  return {
    pincode,
    remainingQuery
  };
}

/**
 * Common Indian city/area patterns that might appear with pincodes
 */
export const LOCATION_KEYWORDS = [
  'near',
  'in',
  'at',
  'around',
  'sector',
  'phase',
  'block',
  'colony',
  'nagar',
  'vihar',
  'puram',
  'ganj',
  'bazar',
  'road',
  'street',
  'lane',
  'park',
  'garden',
  'enclave',
  'apartments',
  'society',
  'complex'
];

/**
 * Checks if a query contains location-related keywords
 * @param query - The search query
 * @returns true if location keywords found
 */
export function hasLocationKeywords(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return LOCATION_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
}