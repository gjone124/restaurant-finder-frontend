// Fetch restaurant details from Google Places API
export const fetchGooglePlacesData = async (query) => {
  const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

  // IMPORTANT: In a production environment, this request should be proxied through a backend server
  // Direct frontend calls to Google Places API will typically be blocked by CORS
  const proxyUrl = "http://localhost:4002/api/proxy"; // Set up a proxy endpoint on your backend
  const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query
  )}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    // For development, you might use a CORS proxy or local backend proxy
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: googlePlacesUrl }),
    });

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Process each place to get additional details including photos
      const placesWithDetails = await Promise.all(
        data.results.slice(0, 6).map(async (place) => {
          // Get place details to retrieve website and other information
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,website,photos&key=${GOOGLE_PLACES_API_KEY}`;

          const detailsResponse = await fetch(proxyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: detailsUrl }),
          });

          const detailsData = await detailsResponse.json();
          const details = detailsData.result || {};

          return {
            name: place.name,
            address: place.formatted_address,
            website: details.website || "No website available",
            // Get first photo or use placeholder
            image:
              details.photos && details.photos.length > 0
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${details.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
                : "https://via.placeholder.com/400?text=No+Image",
            location: place.geometry.location,
          };
        })
      );

      return placesWithDetails;
    }
    return [];
  } catch (error) {
    console.error("Error fetching Google Places data:", error);
    return [];
  }
};

// fetches user's current location using "navigator.geolocation"
// uses Google Places API to reverse geocode coordinates
// formats location based on the country
// for the USA => "City, State (2 letter abbreviation), USA"
// for Canada => "City, Province (2 letter abbreviation), Canada"
// for the UK => "City, Region (England, Wales, Scotland etc.), UK"
// for all other countries => "City, Country"
export const fetchUserLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const GOOGLE_PLACES_API_KEY = import.meta.env
            .VITE_GOOGLE_PLACES_API_KEY;
          const proxyUrl = "http://localhost:4002/api/proxy";

          const reverseGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`;

          try {
            const response = await fetch(proxyUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: reverseGeocodeUrl }),
            });

            const data = await response.json();
            if (data.results.length === 0) {
              reject("No location found");
              return;
            }

            // Extract address components
            let city = "";
            let stateOrRegion = "";
            let country = "";

            for (const component of data.results[0].address_components) {
              if (component.types.includes("locality")) {
                city = component.long_name;
              }
              if (component.types.includes("administrative_area_level_1")) {
                stateOrRegion = component.short_name; // US states, Canadian provinces (2-letter)
              }
              if (component.types.includes("country")) {
                country = component.long_name;
              }
            }

            // Apply formatting rules
            let formattedLocation = `${city}, ${country}`;
            if (country === "United States") {
              formattedLocation = `${city}, ${stateOrRegion}, USA`;
            } else if (country === "Canada") {
              formattedLocation = `${city}, ${stateOrRegion}, Canada`;
            } else if (country === "United Kingdom") {
              formattedLocation = `${city}, ${stateOrRegion}, UK`; // UK regions (England, Wales, etc.)
            }

            resolve(formattedLocation);
          } catch (error) {
            console.error("Error fetching reverse geocode data:", error);
            reject(error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};
