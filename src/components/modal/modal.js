// src/Modal.js
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './modal.css';

const Modal = ({ isOpen, onClose, children, title = "Уведомление", content = "This is a simple modal window"}) => {
  useEffect(() => {
    // Prevent scrolling when the modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset'; // Clean up on unmount
    };
  }, [isOpen]);

  if (!isOpen) return null; // Don't render the modal if it's not open

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className='modal-title'>{title}</h2>
        <p className='modal-content'>{content}</p>
        {children}
      </div>
    </div>,
    document.body // Render the modal at the end of the body
  );
};

export default Modal;