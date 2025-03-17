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
        className="modal__item-modal-restaurant-image"
      />
      <div className="modal__item-modal-info">
        <h2 className="modal__item-modal-restaurant-name">{item.name}</h2>
        <p className="modal__item-modal-restaurant-cuisine">
          {item.cuisine} Cuisine
        </p>
        <p className="modal__item-modal-restaurant-address">{item.address}</p>
        <p className="modal__item-modal-restaurant-website">{item.website}</p>
        {item.distance && (
          <p className="modal__item-modal-distance">
            Distance From User in Miles: {item.distance}
          </p>
        )}

        {showDeleteButton && ( // conditionally render delete button only on profile page
          <button
            className="modal__item-modal-delete-button"
            onClick={handleDeleteItemModalClick}
          >
            Delete Item
          </button>
        )}
      </div>
    </Modal>
  );
}

export default ItemModal;
