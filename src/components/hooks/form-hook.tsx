import React, { useCallback, useReducer } from "react";

/* =========================
   TYPES
========================= */
interface InputState {
  value: string | number;
  isValid: boolean;
}

interface FormInputs {
  [key: string]: InputState;
}

interface FormState {
  inputs: FormInputs;
  isValid: boolean;
}

type FormAction =
  | {
      type: "INPUT_CHANGE";
      inputId: string;
      value: string | number;
      isValid: boolean;
    }
  | {
      type: "SET_DATA";
      inputs: FormInputs;
      formIsValid: boolean;
    };

/* =========================
   REDUCER
========================= */

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "INPUT_CHANGE": {
      let formIsValid = true;
      for (const inputId in state.inputs) {
        //fix for switching login to signup mode in auth.jsx
        if (!state.inputs[inputId]) {
          continue;
        }
        //end of fix

        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    }

    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

/* =========================
   HOOK
========================= */
export const useForm = (
  initialInputs: FormInputs,
  initialFormValidity: boolean
): [
  FormState,
  (id: string, value: string | number, isValid: boolean) => void,
  (inputData: FormInputs, formValidity: boolean) => void
] => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback(
    (id: string, value: string | number, isValid: boolean) => {
      dispatch({
        type: "INPUT_CHANGE",
        value: value,
        isValid: isValid,
        inputId: id,
      });
    },
    []
  );

  // initialization of form while data is fetching
  const setFormData = useCallback(
    (inputData: FormInputs, formValidity: boolean) => {
      dispatch({
        type: "SET_DATA",
        inputs: inputData,
        formIsValid: formValidity,
      });
    },
    []
  );

  return [formState, inputHandler, setFormData];
};
