// Fetch cuisine type from OpenStreetMap Overpass API
export const fetchOSMCuisineData = async (lat, lon) => {
  // Build a query to find restaurants near the given coordinates
  const overpassQuery = `[out:json];
      node(around:300, ${lat}, ${lon})["amenity"="restaurant"];
      
      out tags center;`;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    const data = await response.json();

    if (data.elements && data.elements.length > 0) {
      // Find the closest restaurant with cuisine information
      const restaurantsWithCuisine = data.elements.filter(
        (element) => element.tags && element.tags.cuisine
      );

      if (restaurantsWithCuisine.length > 0) {
        // Calculate distances to find the closest restaurant
        const closestRestaurant = restaurantsWithCuisine.reduce(
          (closest, current) => {
            const currentLat = current.lat || current.center?.lat;
            const currentLon = current.lon || current.center?.lon;

            if (!currentLat || !currentLon) return closest;

            const currentDistance = calculateDistance(
              lat,
              lon,
              currentLat,
              currentLon
            );
            const closestDistance = closest.distance || Infinity;

            return currentDistance < closestDistance
              ? { ...current, distance: currentDistance }
              : closest;
          },
          { distance: Infinity }
        );

        return closestRestaurant.tags.cuisine || "Unknown";
      }
    }
    return "Unknown";
  } catch (error) {
    console.error("Error fetching OpenStreetMap cuisine data:", error);
    return "Unknown";
  }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
