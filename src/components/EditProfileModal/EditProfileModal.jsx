import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";
import "./EditProfileModal.css";

function EditProfileModal({ onClose, activeModal }) {
  return (
    <ModalWithForm
      name="edit-profile-form"
      title="Change profile data"
      buttonText="Save changes"
      activeModal={activeModal}
      onClose={onClose}
    >
      <label htmlFor="username" className="modal-form__label">
        Username{" "}
        <input
          name="username"
          type="text"
          className="modal-form__input"
          id="username"
          placeholder="Username"
          required
        />
      </label>

      <label htmlFor="avatar" className="modal-form__label">
        Avatar{" "}
        <input
          name="avatar"
          type="url"
          className="modal-form__input"
          id="avatar"
          placeholder="Avatar"
          required
        />
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
