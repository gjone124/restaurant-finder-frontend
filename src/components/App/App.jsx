// React elements
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

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

// Styling for App.jsx
import "./App.css";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [restaurantItems, setRestaurantItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

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

  /* Submit Handlers */
  function handleSubmit(request) {
    return request()
      .then(() => closeActiveModal())
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // fetch to server, add item to server, & then add item to the DOM
  function handleAddItemModalSubmit(item) {
    const addItemRequest = () => {
      return postItem(item).then((data) => {
        setRestaurantItems([data, ...restaurantItems]);
      });
    };
    return handleSubmit(addItemRequest);
  }

  function handleDeleteItemModalSubmit(item) {
    const deleteRequest = () => {
      return deleteItem(selectedCard._id).then(() => {
        setRestaurantItems(
          restaurantItems.filter((restaurantItem) => {
            return restaurantItem !== selectedCard;
          })
        );
      });
    };

    return handleSubmit(deleteRequest);
  }

  // get items
  useEffect(() => {
    getItems()
      .then((data) => {
        setRestaurantItems(data.reverse());
      })
      .catch(console.error);
  }, []);

  return (
    <div className="page">
      <div className="page__content">
        <Header
          handleAddModalClick={handleAddModalClick}
          setRestaurantItems={setSearchResults}
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
