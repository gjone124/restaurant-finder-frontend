// React elements
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Header from "../Header/Header";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";

// Modals (part of Components)
import ItemModal from "../ItemModal/ItemModal";
import AddItemModal from "../AddItemModal/AddItemModal";
import DeleteItemModal from "../DeleteItemModal/DeleteItemModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal.jsx";

// Utilities
import { getItems, postItem, deleteItem } from "../../utils/api.js";
import { defaultRestaurantItems } from "../../utils/constants.js";
import { fetchOSMRestaurantData } from "../../utils/openStreetMapOverpassApi";
import { fetchUserLocation } from "../../utils/locationService";
import { coordinates } from "../../utils/constants";

// Styling for App.jsx
import "./App.css";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [restaurantItems, setRestaurantItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isMobileMenuOpened, setMobileMenuOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // get current location for routing
  const location = useLocation();

  /* Modal Handlers */
  const handleAddModalClick = () => {
    setActiveModal("add-restaurant-form");
  };

  const handleDeleteItemModalClick = () => {
    setActiveModal("delete");
  };

  const handleCardClick = (item) => {
    setActiveModal("preview");
    setSelectedCard(item);
  };

  const handleEditProfileModalClick = () => {
    setActiveModal("edit-profile-form");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpened(!isMobileMenuOpened);
  };

  /* Submit Handlers */
  function handleSubmit(request) {
    return request()
      .then(() => closeActiveModal())
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // add item to state variable
  function handleAddItemModalSubmit(item) {
    const addItemRequest = () => {
      // generate unique ID for new item
      const newItem = {
        ...item,
        _id: Math.random().toString(36).substr(2, 9),
      };
      setRestaurantItems([newItem, ...restaurantItems]);
    };

    return handleSubmit(addItemRequest);
  }

  function handleDeleteItemModalSubmit() {
    const deleteRequest = () => {
      setRestaurantItems(
        restaurantItems.filter((restaurantItem) => {
          return restaurantItem._id !== selectedCard._id;
        })
      );
    };

    return handleSubmit(deleteRequest);
  }

  // Handle search query change
  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
  };

  // Search restaurants function - moved from SearchBarForm
  const searchRestaurants = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!searchQuery) {
      alert("Please enter a search query.");
      return;
    }

    setIsSearching(true);

    try {
      // Get user coordinates or fallback to defaults
      const userCoords = userLocation || {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      };

      // Search restaurants using OpenStreetMap
      const results = await fetchOSMRestaurantData(
        userCoords.lat,
        userCoords.lng,
        searchQuery
      );

      if (results.length === 0) {
        alert("No restaurants found. Please try a different search.");
        setIsSearching(false);
        return;
      }

      console.log(`Found ${results.length} restaurants via OpenStreetMap.`);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      alert(
        "An error occurred while searching for restaurants. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  // fetch user's location on component mount (using Open Street Map Overpass API)
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

  // load default restaurant items from constants file on mmount
  useEffect(() => {
    setRestaurantItems(defaultRestaurantItems);
  }, []);

  return (
    <div className="page">
      <div className="page__content">
        <Header
          handleAddModalClick={handleAddModalClick}
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          onSearchSubmit={searchRestaurants}
          isSearching={isSearching}
          userLocation={userLocation?.formattedLocation}
          isMenuOpen={isMobileMenuOpened}
          onMenuOpen={toggleMobileMenu}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Main
                onCardClick={handleCardClick}
                restaurantItems={searchResults.length > 0 ? searchResults : []}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                onCardClick={handleCardClick}
                handleAddModalClick={handleAddModalClick}
                handleEditProfileModalClick={handleEditProfileModalClick}
                restaurantItems={restaurantItems}
              />
            }
          />
        </Routes>

        <Footer />
      </div>
      <AddItemModal
        activeModal={activeModal}
        onClose={closeActiveModal}
        onAddItemModalSubmit={handleAddItemModalSubmit}
      />
      <ItemModal
        name="preview"
        activeModal={activeModal}
        item={selectedCard}
        onClose={closeActiveModal}
        handleDeleteItemModalClick={handleDeleteItemModalClick}
        showDeleteButton={location.pathname === "/profile"} // show delete button only on profile page
      />
      <DeleteItemModal
        name="delete"
        activeModal={activeModal}
        onClose={closeActiveModal}
        onDeleteItemModalSubmit={handleDeleteItemModalSubmit}
      />

      <EditProfileModal
        name="edit-profile-form"
        activeModal={activeModal}
        onClose={closeActiveModal}
        handleEditProfileModalClick={handleEditProfileModalClick}
      />
    </div>
  );
}

export default App;
