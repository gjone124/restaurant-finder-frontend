import { useState } from "react";

import "./AddItemModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function AddItemModal({ onClose, activeModal, onAddItemModalSubmit }) {
  const [itemData, setItemData] = useState({
    name: "",
    cuisine: "",
    address: "",
    image: "",
    website: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItemData((previousItemData) => ({
      ...previousItemData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("submitted add item modal");
    onAddItemModalSubmit({
      name: itemData.name,
      cuisine: itemData.cuisine,
      address: itemData.address,
      image: itemData.image,
      website: itemData.website,
    });
    setItemData({
      name: "",
      cuisine: "",
      address: "",
      image: "",
      website: "",
    });
  };

  return (
    <ModalWithForm
      name="add-restaurant-form"
      title="New Restaurant"
      buttonText="Add Restaurant"
      activeModal={activeModal}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label htmlFor="restaurant-name" className="modal-form__label">
        Name{" "}
        <input
          name="name"
          type="text"
          className="modal-form__input"
          id="restaurant-name"
          placeholder="Name"
          onChange={handleChange}
          value={itemData.name}
          required
        />
      </label>

      <label htmlFor="restaurant-cuisine" className="modal-form__label">
        Cuisine{" "}
        <input
          name="cuisine"
          type="text"
          className="modal-form__input"
          id="restaurant-cuisine"
          placeholder="Cuisine"
          onChange={handleChange}
          value={itemData.cuisine}
          required
        />
      </label>

      <label htmlFor="restaurant-address" className="modal-form__label">
        Address{" "}
        <input
          name="address"
          type="text"
          className="modal-form__input"
          id="restaurant-address"
          placeholder="Address"
          onChange={handleChange}
          value={itemData.address}
          required
        />
      </label>

      <label htmlFor="restaurant-image" className="modal-form__label">
        Image{" "}
        <input
          name="image"
          type="url"
          className="modal-form__input"
          id="restaurant-image"
          placeholder="Image URL or Image Upload"
          onChange={handleChange}
          value={itemData.image}
        />
      </label>

      <label htmlFor="restaurant-website" className="modal-form__label">
        Website{" "}
        <input
          name="website"
          type="url"
          className="modal-form__input"
          id="restaurant-website"
          placeholder="Website URL"
          onChange={handleChange}
          value={itemData.website}
        />
      </label>
    </ModalWithForm>
  );
}

export default AddItemModal;
