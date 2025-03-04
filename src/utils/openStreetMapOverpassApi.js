// Fetch cuisine type from OpenStreetMap Overpass API

// compares coordinates & the restaurant name for the Google Places API
// & the Overpass API in order to find a matching restaurant
// & then set the cuisine value to that restaurant
export const fetchOSMCuisineData = async (lat, lon, restaurantName) => {
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

    // added for testing purposes (console.log statement)
    if (data.elements && data.elements.length > 0) {
      data.elements.forEach((element) => {
        if (element.tags && element.tags.cuisine) {
          console.log(
            `OSM Restaurant Found - Name: ${
              element.tags.name || "Unknown"
            }, Lat: ${element.lat || element.center?.lat}, Lng: ${
              element.lon || element.center?.lon
            }, Cuisine: ${element.tags.cuisine}`
          );
        }
      });
    }

    if (data.elements && data.elements.length > 0) {
      // First try to find a restaurant with a matching name
      const normalizedSearchName = restaurantName.toLowerCase().trim();

      // Look for exact or similar name matches first
      const matchingRestaurants = data.elements.filter((element) => {
        if (element.tags && element.tags.name) {
          const osmName = element.tags.name.toLowerCase().trim();
          return (
            osmName.includes(normalizedSearchName) ||
            normalizedSearchName.includes(osmName)
          );
        }
        return false;
      });

      // If we found matching restaurant(s), use the cuisine from the first match with cuisine info
      if (matchingRestaurants.length > 0) {
        const matchWithCuisine = matchingRestaurants.find(
          (element) => element.tags && element.tags.cuisine
        );

        if (matchWithCuisine) {
          console.log(
            `Found matching restaurant: ${matchWithCuisine.tags.name} with cuisine: ${matchWithCuisine.tags.cuisine}`
          );
          return matchWithCuisine.tags.cuisine;
        }
      }

      // For chain restaurants with known cuisines, you can hardcode them
      const knownCuisines = {
        "mcdonald's": "fast_food;burger",
        "burger king": "fast_food;burger",
        wendys: "fast_food;burger",
        "pizza hut": "pizza",
        dominos: "pizza",
        "taco bell": "mexican;fast_food",
        kfc: "chicken;fast_food",
        subway: "sandwich;fast_food",
        chipotle: "mexican",
        "olive garden": "italian",
        "outback steakhouse": "steak",
        applebees: "american",
        chilis: "american",
      };

      // Check if this is a known chain restaurant
      for (const [chain, cuisine] of Object.entries(knownCuisines)) {
        if (normalizedSearchName.includes(chain)) {
          console.log(
            `Using known cuisine for chain restaurant: ${restaurantName} → ${cuisine}`
          );
          return cuisine;
        }
      }

      // If no match found, then look for restaurants with cuisine info by proximity
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

        console.log(
          `No exact match found, using closest restaurant's cuisine as fallback: ${closestRestaurant.tags.cuisine}`
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
