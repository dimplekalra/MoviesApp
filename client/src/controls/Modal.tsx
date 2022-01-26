import React from "react";

interface IProps {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  children: React.ReactChild;
}

const Modal = React.forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const { title, onCancel, onConfirm } = props;

  return (
    <div className="modal black-text" ref={ref}>
      <div className="modal-title">
        <h2 className="center-align"> {title} </h2>{" "}
      </div>
      <div className="modal-content">{props.children}</div>
      <div className="modal-footer">
        <button
          className="modal-close waves-effect waves-green btn-flat"
          onClick={onConfirm}
        >
          Yes
        </button>
        <button
          className="modal-close waves-effect waves-red btn-flat"
          onClick={onCancel}
        >
          No
        </button>
      </div>
    </div>
  );
});

export default Modal;
