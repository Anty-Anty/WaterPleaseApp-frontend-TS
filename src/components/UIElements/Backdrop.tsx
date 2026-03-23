import React from "react";
import ReactDOM from "react-dom";

import "./Backdrop.css";

interface BackdropProps {
  onClickProp: () => void;
}

const Backdrop: React.FC<BackdropProps> = (props) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClickProp}></div>,
    document.getElementById("backdrop-hook") as HTMLElement
  );
};

export default Backdrop;
