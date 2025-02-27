import { useState } from "react";
import "./SearchBarForm.css";
import { fetchGooglePlacesData } from "../../utils/googlePlacesApi";
import { fetchOSMCuisineData } from "../../utils/openStreetMapOverpassApi";

const SearchBarForm = ({ setRestaurantItems }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setQuery(e.target.value);
    console.log(setQuery(), e.target.value);
  };

  const searchRestaurants = async () => {
    if (!query) {
      alert("Please enter a search query.");
      return;
    }

    setLoading(true);

    try {
      // First, fetch basic restaurant data from Google Places API
      const googlePlacesResults = await fetchGooglePlacesData(query);

      if (googlePlacesResults.length === 0) {
        alert("No restaurants found. Please try a different search.");
        setLoading(false);
        return;
      }

      // For each restaurant, fetch cuisine data from OpenStreetMap
      const restaurantsWithCuisine = await Promise.all(
        googlePlacesResults.map(async (restaurant) => {
          const cuisine = await fetchOSMCuisineData(
            restaurant.location.lat,
            restaurant.location.lng
          );

          return {
            ...restaurant,
            cuisine,
            id: Math.random().toString(36).substr(2, 9), // Generate a unique ID for each restaurant
          };
        })
      );

      // Update the restaurant items state with combined data
      setRestaurantItems(restaurantsWithCuisine);
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
