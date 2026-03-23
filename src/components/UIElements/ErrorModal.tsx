import React from "react";

import Modal from "./Modal";
import "./ErrorModal.css";

interface ErrorModalProps {
  error: string | null;
  onClear: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="✖"
      headerClass="err-modal"
      show={!!props.error}
      footer={<button onClick={props.onClear}>Ok</button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
