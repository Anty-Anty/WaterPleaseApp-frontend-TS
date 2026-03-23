import React, { useReducer, useEffect } from "react";

import { validate, Validator } from "../util/validators";
import "./Input.css";

/* =========================
   REDUCER TYPES
========================= */
interface InputState {
  value: string;
  isTouched: boolean;
  isValid: boolean;
}

type InputAction =
  | { type: "CHANGE"; val: string; validators: Validator[] }
  | { type: "TOUCH" };

/* =========================
   REDUCER
========================= */
//useReducer function
const inputReducer = (state: InputState, action: InputAction): InputState => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

/* =========================
   PROPS
========================= */
interface InputProps {
  id: string;
  element?: "input" | "textarea";
  name?: string;
  type?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  initialValue?: string;
  initialValidity?: boolean;
  validators: Validator[];
  errorText: string;
  onInput: (id: string, value: string, isValid: boolean) => void;
}

/* =========================
     COMPONENT
  ========================= */

const Input: React.FC<InputProps> = (props) => {
  // useReducer
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValidity || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //useReducer action
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={touchHandler}
        className={`${props.className} ${
          !inputState.isValid && "add-item-invalid"
        }`}
      />
    ) : (
      <textarea
        id={props.id}
        name={props.name}
        rows={props.rows || 3}
        placeholder={props.placeholder}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={touchHandler}
        className={`${props.className} ${
          !inputState.isValid && inputState.isTouched && "add-item-invalid"
        }`}
      />
    );

  return (
    <>
      {/* <div> around your input and error — so the error can position relative to it. */}
      <div className="input-wrapper">
        {element}
        {!inputState.isValid && inputState.isTouched && (
          <div className="err">{props.errorText}</div>
        )}
      </div>
    </>
  );
};

export default Input;
