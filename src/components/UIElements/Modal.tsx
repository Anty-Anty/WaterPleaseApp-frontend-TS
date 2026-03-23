import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";
import "./Modal.css";

interface ModalOverlayProps {
  nodeRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  style?: React.CSSProperties;
  headerClass?: string;
  header?: string;
  contentClass?: string;
  footerClass?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onSubmit?: (event: React.FormEvent) => void;
}

interface ModalProps extends Omit<ModalOverlayProps, "nodeRef"> {
  show: boolean;
  onCancel: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = (props) => {
  const content = (
    <div
      ref={props.nodeRef}
      className={`modal ${props.className}`}
      style={props.style}
    >
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById("modal-hook") as HTMLElement
  );
};

const Modal: React.FC<ModalProps> = (props) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {props.show && <Backdrop onClickProp={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={300}
        classNames="fade"
        nodeRef={nodeRef}
      >
        <ModalOverlay {...props} nodeRef={nodeRef} />
      </CSSTransition>
    </>
  );
};

export default Modal;
