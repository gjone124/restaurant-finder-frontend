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
      <p className="delete-modal__confirmation">
        Are you sure you want to delete this item? <br /> This action is
        irreversible.
      </p>
      <button
        className="delete-modal__button delete-modal__button_type_delete"
        onClick={onDeleteItemModalSubmit}
      >
        Yes, delete item
      </button>
      <button className="delete-modal__button" onClick={onClose}>
        Cancel
      </button>
    </Modal>
  );
}

export default DeleteItemModal;
