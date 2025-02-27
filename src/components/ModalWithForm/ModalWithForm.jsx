import "./ModalWithForm.css";
import Modal from "../Modal/Modal";

function ModalWithForm({
  name,
  onClose,
  activeModal,
  title,
  buttonText,
  onSubmit,
  children,
}) {
  return (
    <Modal name={name} type="form" onClose={onClose} activeModal={activeModal}>
      <h2 className="modal-form__title">{title}</h2>
      <form name={name} className="modal-form__form" onSubmit={onSubmit}>
        {children}
        <button type="submit" className="modal-form__button">
          {buttonText}
        </button>
      </form>
    </Modal>
  );
}

export default ModalWithForm;
