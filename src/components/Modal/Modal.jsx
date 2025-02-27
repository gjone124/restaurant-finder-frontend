import { useEffect } from "react";

import "./Modal.css";

function Modal({ name, type, onClose, activeModal, children }) {
  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [onClose]);

  const onOverlay = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`modal modal__type_${type} ${
        activeModal === name && "modal_opened"
      }`}
      onMouseDown={onOverlay}
    >
      <div className={`modal__content modal__content_type_${type}`}>
        <button
          type="button"
          className={`modal__close-button modal__close-button_type_${type}`}
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );
}

export default Modal;
