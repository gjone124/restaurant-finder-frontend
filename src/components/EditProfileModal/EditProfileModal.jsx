import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";
import "./EditProfileModal.css";

function EditProfileModal({ onClose, activeModal }) {
  //   const [userData, setUserData] = useState({
  //     name: "",
  //     avatar: "",
  //   });

  //   const handleChange = (event) => {
  //     const { name, value } = event.target;
  //     setUserData((previousUserData) => ({
  //       ...previousUserData,
  //       [name]: value,
  //     }));
  //   };

  return (
    <ModalWithForm
      name="edit-profile-form"
      title="Change profile data"
      buttonText="Save changes"
      activeModal={activeModal}
      onClose={onClose}
      // onSubmit={handleSubmit}
    >
      <label htmlFor="username" className="modal-form__label">
        Username{" "}
        <input
          name="username"
          type="text"
          className="modal-form__input"
          id="username"
          placeholder="Username"
          // onChange={handleChange}
          // value={itemData.name}
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
          // onChange={handleChange}
          // value={itemData.cuisine}
          required
        />
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
