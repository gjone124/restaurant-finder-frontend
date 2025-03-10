import "./ItemModal.css";
import Modal from "../Modal/Modal.jsx";

function ItemModal({
  name,
  onClose,
  activeModal,
  item,
  handleDeleteItemModalClick,
  showDeleteButton,
}) {
  return (
    <Modal name={name} type="item" onClose={onClose} activeModal={activeModal}>
      <img
        src={item.image}
        alt={item.name}
        className="item-modal__restaurant-image"
      />
      <div className="item-modal__info">
        <h2 className="item-modal__restaurant-name">{item.name}</h2>
        <p className="item-modal__restaurant-cuisine">{item.cuisine} Cuisine</p>
        <p className="item-modal__restaurant-address">{item.address}</p>
        <p className="item-modal__restaurant-website">{item.website}</p>
        {item.distance && (
          <p className="item-modal__distance">
            Distance From User in Miles: {item.distance}
          </p>
        )}

        {showDeleteButton && ( // conditionally render delete button only on profile page
          <button
            className="item-modal__delete-button"
            onClick={handleDeleteItemModalClick}
          >
            Delete item
          </button>
        )}
      </div>
    </Modal>
  );
}

export default ItemModal;
