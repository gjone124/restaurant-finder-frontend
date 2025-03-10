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

// Styling for App.jsx
import "./App.css";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [restaurantItems, setRestaurantItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // get current location for routing
  const location = useLocation();

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

  // add item to state variable (will add item to server for full stack application)
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

  // [method for full stack application]
  // function handleAddItemModalSubmit(item) {
  //   const addItemRequest = () => {
  //     return postItem(item).then((data) => {
  //       setRestaurantItems([data, ...restaurantItems]);
  //     });
  //   };
  //   return handleSubmit(addItemRequest);
  // }

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

  // [method for full stack application]
  // function handleDeleteItemModalSubmit(item) {
  //   const deleteRequest = () => {
  //     return deleteItem(selectedCard._id).then(() => {
  //       setRestaurantItems(
  //         restaurantItems.filter((restaurantItem) => {
  //           return restaurantItem !== selectedCard;
  //         })
  //       );
  //     });
  //   };

  //   return handleSubmit(deleteRequest);
  // }

  // load default restaurant items from constants file
  useEffect(() => {
    setRestaurantItems(defaultRestaurantItems);
  }, []);

  // load restaurant items by fetching from db.json file [method for full stack application]
  // useEffect(() => {
  //   getItems()
  //     .then((data) => {
  //       setRestaurantItems(data.reverse());
  //     })
  //     .catch(console.error);
  // }, []);

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
