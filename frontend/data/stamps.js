/**
 * Centralized stamp data configuration
 * Update this file to add/remove stamps from the application
 */

// Known stamp IDs that have been created through the admin panel
// TODO: Replace this with dynamic fetching from blockchain events or contract storage
export const knownStampIds = [
  "coffeerunner",
  "hackathon-hero",
  "city-walker"
];

// You can also add metadata about stamps here if needed
export const stampMetadata = {
  "coffeerunner": {
    displayName: "Coffee Runner",
    category: "Food & Drink"
  },
  "hackathon-hero": {
    displayName: "Hackathon Hero", 
    category: "Tech Events"
  },
  "city-walker": {
    displayName: "City Walker",
    category: "Lifestyle"
  }
};

// Helper function to get all stamp IDs
export const getAllStampIds = () => {
  return [...knownStampIds];
};

// Helper function to check if a stamp ID exists
export const isValidStampId = (stampId) => {
  return knownStampIds.includes(stampId);
}; 