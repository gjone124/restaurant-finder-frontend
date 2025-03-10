// for full stack application
// import { useState, useEffect } from "react";
// import "./SearchBarForm.css";
// import {
//   fetchGooglePlacesData,
//   fetchUserLocation,
//   getDistanceFromUser,
// } from "../../utils/googlePlacesApi";
// import { fetchOSMCuisineData } from "../../utils/openStreetMapOverpassApi";

// const SearchBarForm = ({ setRestaurantItems }) => {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [userLocation, setUserLocation] = useState(null);
//   const [userCoordinates, setUserCoordinates] = useState(null);

//   useEffect(() => {
//     const updateUserLocation = async () => {
//       try {
//         const locationData = await fetchUserLocation();
//         setUserLocation(locationData.formattedLocation);
//         setUserCoordinates(locationData.coordinates);
//       } catch {
//         setUserLocation("Location unavailable");
//         setUserCoordinates(null);
//       }
//     };

//     updateUserLocation();
//   }, []);

//   const handleChange = (e) => {
//     setQuery(e.target.value);
//   };

//   const searchRestaurants = async () => {
//     if (!query) {
//       alert("Please enter a search query.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // First, fetch basic restaurant data from Google Places API
//       const googlePlacesResults = await fetchGooglePlacesData(query);

//       if (googlePlacesResults.length === 0) {
//         alert("No restaurants found. Please try a different search.");
//         setLoading(false);
//         return;
//       }

//       console.log(
//         `Google Places API returned ${googlePlacesResults.length} result(s).`
//       );

//       // For each restaurant, fetch cuisine data from OpenStreetMap
//       const restaurantsWithCuisine = await Promise.all(
//         googlePlacesResults.map(async (restaurant) => {
//           console.log(
//             `Fetching OSM cuisine data for: ${restaurant.name} (Lat: ${restaurant.location.lat}, Lon: ${restaurant.location.lng})`
//           );

//           const cuisine = await fetchOSMCuisineData(
//             restaurant.location.lat,
//             restaurant.location.lng,
//             restaurant.name
//           );

//           console.log(`Cuisine Type (OSM): ${cuisine}`);

//           return {
//             ...restaurant,
//             cuisine,
//             distance: userCoordinates
//               ? getDistanceFromUser(userCoordinates, restaurant.location)
//               : "Unknown",
//             id: Math.random().toString(36).substr(2, 9), // Generate a unique ID for each restaurant
//           };
//         })
//       );

//       console.log("Final Merged Restaurant Data:", restaurantsWithCuisine);
//       // Update the restaurant items state with combined data
//       setRestaurantItems(restaurantsWithCuisine);
//     } catch (error) {
//       console.error("Error searching restaurants:", error);
//       alert(
//         "An error occurred while searching for restaurants. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="search-container">
//       <input
//         type="text"
//         value={query}
//         onChange={handleChange}
//         placeholder="Search For Restaurant(s) Here"
//         className="search-bar"
//       />
//       <button onClick={searchRestaurants} disabled={loading}>
//         {loading ? "Searching..." : "Search"}
//       </button>
//     </div>
//   );
// };

// export default SearchBarForm;

import { useState, useEffect } from "react";
import "./SearchBarForm.css";
import { coordinates } from "../../utils/constants";
import { fetchOSMRestaurantData } from "../../utils/openStreetMapOverpassApi";
import { fetchUserLocation } from "../../utils/locationService";

const SearchBarForm = ({ setRestaurantItems }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        // use location service to access user's current location
        const locationData = await fetchUserLocation();
        setUserLocation({
          lat: locationData.coordinates.lat,
          lng: locationData.coordinates.lng,
          formattedLocation: locationData.formattedLocation,
        });
      } catch (error) {
        console.error("Error getting location:", error);
        // use default Washington DC coordinates as fallback
        setUserLocation({
          lat: coordinates.latitude,
          lng: coordinates.longitude,
          formattedLocation: "Washington, DC, USA",
        });
      }
    };

    getUserLocation();
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const searchRestaurants = async () => {
    if (!query) {
      alert("Please enter a search query.");
      return;
    }

    setLoading(true);

    try {
      // Get user coordinates or fallback to defaults
      const userCoords = userLocation || {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      };

      // Search restaurants using OpenStreetMap only
      const results = await fetchOSMRestaurantData(
        userCoords.lat,
        userCoords.lng,
        query
      );

      if (results.length === 0) {
        alert("No restaurants found. Please try a different search.");
        setLoading(false);
        return;
      }

      console.log(`Found ${results.length} restaurants via OpenStreetMap.`);
      setRestaurantItems(results);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      alert(
        "An error occurred while searching for restaurants. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search For Restaurant(s) Here"
        className="search-bar"
      />
      <button onClick={searchRestaurants} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchBarForm;
