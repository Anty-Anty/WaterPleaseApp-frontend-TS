// This component lets the user enter the number of days until the next watering.
// Based on the lastWateredDate prop, it calculates and displays the next watering date
// (formatted like "Sep 15"), validates the input, and reports the computed value
// to the parent through onInput().

import React, { useState, useEffect } from "react";
import { validate, Validator } from "../util/validators";
import { addDays } from "../util/days";
import "./NextWaterDateInput.css";

// function addDays(dateStr, days) {
//     if (!dateStr) return "";
//     const [y, m, d] = dateStr.split("-").map(Number);
//     const base = new Date(y, m - 1, d); // safe construction, no TZ issues
//     base.setDate(base.getDate() + Number(days));

//     // Format as "Sep 15"
//     return base.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//     });
// }

interface NextWaterDateInputProps {
  id: string;
  placeholder?: string;
  initialDays?: number | string;
  lastWateredDate: string;
  validators: Validator[];
  errorText?: string;
  readOnly?: boolean;
  onInput: (id: string, value: string | number, isValid: boolean) => void;
}

const NextWaterDateInput: React.FC<NextWaterDateInputProps> = (props) => {
  const [days, setDays] = useState<string | number>(props.initialDays || "");
  const [nextDate, setNextDate] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  // Calculate next watering date
  useEffect(() => {
    const ready = props.lastWateredDate && days !== "";
    const valid = ready && validate(days, props.validators || []);

    if (!ready) {
      if (days !== "") {
        // notify initial value even if lastWateredDate not ready yet
        const validInitial = validate(days, props.validators || []);
        props.onInput(props.id, days, validInitial);
      }
      setNextDate("");
      return;
    }

    if (!valid) {
      setNextDate("");
      props.onInput(props.id, "", false);
      return;
    }

    const computed = addDays(props.lastWateredDate, Number(days));
    setNextDate(computed);
    props.onInput(props.id, days, true);
  }, [days, props.lastWateredDate]);

  return (
    <div className="input-wrapper">
      <input
        type="number"
        min="1"
        placeholder={
          // props.nextWateredDate ? formatDisplayDate(props.nextWateredDate) :
          props.placeholder
        }
        className={`number-input ${
          !isValid && isTouched ? "add-item-invalid" : ""
        }`}
        value={days}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDays(e.target.value)
        }
        onBlur={() => {
          setIsTouched(true);
          setIsValid(
            !days || !validate(days, props.validators || []) ? false : true
          );
        }}
      />

      {nextDate && <div className="next-date-ghost">{nextDate}</div>}

      {!isValid && isTouched && (
        <div className="err">
          {props.errorText || "Please enter at least 1 day."}
        </div>
      )}
    </div>
  );
};

export default NextWaterDateInput;
