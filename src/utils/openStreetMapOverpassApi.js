// for frontend only application
// enhanced OpenStreetMap Overpass API functions handle both restaurant search and cuisine detection

import { handleServerResponse } from "./api.js";

// Calculate distance between two geographic coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 3958.8; // Radius of the Earth in miles

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); // distance in miles
};

// Main function to search for restaurants with OpenStreetMap
export const fetchOSMRestaurantData = async (lat, lon, searchQuery) => {
  // Build a query to find restaurants near the given coordinates with name search
  const searchTerm = searchQuery.toLowerCase().trim();
  const radius = 5000; // 5 km radius search

  const overpassQuery = `[out:json];
    (
      node(around:${radius}, ${lat}, ${lon})["amenity"="restaurant"][name~"${searchTerm}", i];
      way(around:${radius}, ${lat}, ${lon})["amenity"="restaurant"][name~"${searchTerm}", i];
      relation(around:${radius}, ${lat}, ${lon})["amenity"="restaurant"][name~"${searchTerm}", i];
    );
    out body center;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    const data = await handleServerResponse(response);

    if (!data.elements || data.elements.length === 0) {
      console.log("No exact matches found, trying broader search");
      // Try a broader search if no exact matches
      return fetchOSMBroadRestaurantSearch(lat, lon, searchQuery);
    }

    console.log(
      `Found ${data.elements.length} restaurant matches in OpenStreetMap`
    );

    // Process the results
    const restaurants = data.elements.map((element) => {
      // Get coordinates
      const restaurantLat = element.lat || element.center?.lat;
      const restaurantLon = element.lon || element.center?.lon;

      // Get address parts
      const street = element.tags.street || element.tags["addr:street"] || "";
      const housenumber =
        element.tags.housenumber || element.tags["addr:housenumber"] || "";
      const city = element.tags.city || element.tags["addr:city"] || "";
      const state = element.tags.state || element.tags["addr:state"] || "";
      const country =
        element.tags.country || element.tags["addr:country"] || "";
      const postcode =
        element.tags.postcode || element.tags["addr:postcode"] || "";

      // Format address
      let address = "";
      if (housenumber && street) address += `${housenumber} ${street}`;
      else if (street) address += street;

      if (city) {
        if (address) address += `, ${city}`;
        else address += city;
      }

      if (state) {
        if (address) address += ` ${state}`;
        else address += state;
      }

      if (postcode) {
        if (address) address += ` ${postcode}`;
        else address += postcode;
      }

      if (!address && element.tags.address) {
        address = element.tags.address;
      }

      // If we still don't have an address, use a placeholder
      if (!address) {
        address = "Address not available";
      }

      // Get website
      const website =
        element.tags.website || element.tags.url || "No website available";

      // Get cuisine
      let cuisine = element.tags.cuisine || "Unknown";

      // Get distance
      const distance = calculateDistance(
        lat,
        lon,
        restaurantLat,
        restaurantLon
      );

      // Create a placeholder image URL based on the restaurant name
      // In a real app, you might use a proper placeholder service or local images
      const placeholderImage = `https://via.placeholder.com/400x300?text=${encodeURIComponent(
        element.tags.name
      )}`;

      return {
        _id: element.id.toString(),
        name: element.tags.name,
        address: address,
        cuisine: cuisine,
        website: website,
        image: placeholderImage,
        location: {
          lat: restaurantLat,
          lng: restaurantLon,
        },
        distance: distance,
      };
    });

    return restaurants;
  } catch (error) {
    console.error("Error fetching OpenStreetMap data:", error);
    throw new Error(`Restaurant search error: ${error.message}`);
  }
};

// Fallback to a broader search if specific search fails
export const fetchOSMBroadRestaurantSearch = async (lat, lon, searchQuery) => {
  // First try to find any restaurants in the area
  const radius = 2000; // 2 km radius search

  const overpassQuery = `[out:json];
    (
      node(around:${radius}, ${lat}, ${lon})["amenity"="restaurant"];
      way(around:${radius}, ${lat}, ${lon})["amenity"="restaurant"];
      relation(around:${radius}, ${lat}, ${lon})["amenity"="restaurant"];
    );
    out body center;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    const data = await handleServerResponse(response);

    if (!data.elements || data.elements.length === 0) {
      console.log("No restaurants found in the area");
      return [];
    }

    console.log(
      `Found ${data.elements.length} restaurants in the broader area`
    );

    // Filter results to find any partial matches to search query
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const filteredResults = data.elements.filter((element) => {
      if (!element.tags.name) return false;

      const name = element.tags.name.toLowerCase();
      // Check if any search term is in the name
      return searchTerms.some((term) => name.includes(term));
    });

    if (filteredResults.length === 0) {
      // If still no matches, just return some nearby restaurants
      console.log("No matches found, returning nearby restaurants");
      // Sort by proximity and return top 6
      return processOSMResults(lat, lon, data.elements.slice(0, 6));
    }

    console.log(`Found ${filteredResults.length} partial matches`);
    // Sort filtered results by relevance and proximity
    return processOSMResults(lat, lon, filteredResults.slice(0, 6));
  } catch (error) {
    console.error("Error in broad restaurant search:", error);
    throw new Error(`Restaurant search error: ${error.message}`);
  }
};

// Helper function to process OSM results
const processOSMResults = (userLat, userLon, elements) => {
  return elements
    .map((element) => {
      // Get coordinates
      const restaurantLat = element.lat || element.center?.lat;
      const restaurantLon = element.lon || element.center?.lon;

      // Get address parts
      const street = element.tags.street || element.tags["addr:street"] || "";
      const housenumber =
        element.tags.housenumber || element.tags["addr:housenumber"] || "";
      const city = element.tags.city || element.tags["addr:city"] || "";
      const state = element.tags.state || element.tags["addr:state"] || "";
      const postcode =
        element.tags.postcode || element.tags["addr:postcode"] || "";

      // Format address
      let address = "";
      if (housenumber && street) address += `${housenumber} ${street}`;
      else if (street) address += street;

      if (city) {
        if (address) address += `, ${city}`;
        else address += city;
      }

      if (state) {
        if (address) address += ` ${state}`;
        else address += state;
      }

      if (postcode) {
        if (address) address += ` ${postcode}`;
        else address += postcode;
      }

      if (!address && element.tags.address) {
        address = element.tags.address;
      }

      if (!address) {
        address = "Address not available";
      }

      // Get website
      const website =
        element.tags.website || element.tags.url || "No website available";

      // Get cuisine
      let cuisine = element.tags.cuisine || "Unknown";

      // Get distance
      const distance = calculateDistance(
        userLat,
        userLon,
        restaurantLat,
        restaurantLon
      );

      // Create a placeholder image URL based on the restaurant name
      const placeholderImage = `https://via.placeholder.com/400x300?text=${encodeURIComponent(
        element.tags.name
      )}`;

      return {
        _id: element.id.toString(),
        name: element.tags.name || "Unknown Restaurant",
        address: address,
        cuisine: cuisine,
        website: website,
        image: placeholderImage,
        location: {
          lat: restaurantLat,
          lng: restaurantLon,
        },
        distance: distance,
      };
    })
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};
