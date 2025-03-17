import { handleServerResponse } from "./api.js";

// Get user's location using browser geolocation and OpenStreetMap reverse geocoding

/**
 * Fetches user's current location using browser geolocation and OpenStreetMap
 * Formats location based on country:
 * - USA => "City, State (2 letter abbreviation), USA"
 * - Canada => "City, Province (2 letter abbreviation), Canada"
 * - UK => "City, Region, UK"
 * - All other countries => "City, Country"
 *
 * @returns {Promise} - Resolves to an object with formattedLocation and coordinates
 */
export const fetchUserLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Use OpenStreetMap's Nominatim service for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );

            const data = await handleServerResponse(response);

            if (!data || !data.address) {
              console.error("No location data found");
              resolve({
                formattedLocation: "Location unavailable",
                coordinates: { lat: latitude, lng: longitude },
              });
              return;
            }

            // Extract address components
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.hamlet ||
              "Unknown";

            const state = data.address.state || "";
            const stateCode = data.address.state_code || state;
            const country = data.address.country || "";
            const countryCode = data.address.country_code || "";

            // Apply formatting rules based on country
            let formattedLocation = "";

            if (countryCode.toLowerCase() === "us") {
              // USA => "City, State (2 letter abbreviation), USA"
              formattedLocation = `${city}, ${stateCode}, USA`;
            } else if (countryCode.toLowerCase() === "ca") {
              // Canada => "City, Province (2 letter abbreviation), Canada"
              formattedLocation = `${city}, ${stateCode}, Canada`;
            } else if (countryCode.toLowerCase() === "gb") {
              // UK => "City, Region, UK"
              const region =
                data.address.state ||
                data.address.county ||
                (data.address.country === "United Kingdom" ? "UK" : "");
              formattedLocation = `${city}, ${region}, UK`;
            } else {
              // All other countries => "City, Country"
              formattedLocation = `${city}, ${country}`;
            }

            // Remove any undefined or null values that might appear
            formattedLocation = formattedLocation
              .replace(/, ,/g, ",")
              .replace(/undefined/g, "")
              .replace(/null/g, "")
              .replace(/,,/g, ",")
              .replace(/, $/g, "");

            // Create coordinates object
            const coordinates = {
              lat: latitude,
              lng: longitude,
            };

            // Return both formatted location and coordinates
            resolve({ formattedLocation, coordinates });
          } catch (error) {
            console.error("Error fetching reverse geocode data:", error);
            resolve({
              formattedLocation: "Location unavailable",
              coordinates: { lat: latitude, lng: longitude },
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};
