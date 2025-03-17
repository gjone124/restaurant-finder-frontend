import Modal from "../Modal/Modal";

import "./DeleteItemModal.css";

function DeleteItemModal({
  name,
  onClose,
  activeModal,
  onDeleteItemModalSubmit,
}) {
  return (
    <Modal
      name={name}
      type="delete"
      onClose={onClose}
      activeModal={activeModal}
    >
      <p className="modal__delete-item-modal-confirmation">
        Are you sure you want to delete this item? <br /> This action is
        irreversible.
      </p>
      <button
        className="modal__delete-item-modal-button modal__delete-item-modal-button_type_delete"
        onClick={onDeleteItemModalSubmit}
      >
        Yes, delete item
      </button>
      <button className="modal__delete-item-modal-button" onClick={onClose}>
        Cancel
      </button>
    </Modal>
  );
}

export default DeleteItemModal;
