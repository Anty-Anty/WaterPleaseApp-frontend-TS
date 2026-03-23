// constants diclared in order for values to be reusable in part 1 and part 2
/* =========================
   VALIDATOR TYPES
========================= */

const VALIDATOR_TYPE_REQUIRE = "REQUIRE";
const VALIDATOR_TYPE_MINLENGTH = "MINLENGTH";
const VALIDATOR_TYPE_MAXLENGTH = "MAXLENGTH";
const VALIDATOR_TYPE_MIN = "MIN";
const VALIDATOR_TYPE_MAX = "MAX";
const VALIDATOR_TYPE_EMAIL = "EMAIL";
const VALIDATOR_TYPE_FILE = "FILE";
const VALIDATOR_TYPE_MAX_TODAY = "MAX_TODAY";
const VALIDATOR_TYPE_MIN_TOMORROW = "MIN_TOMORROW";

/* =========================
   VALIDATOR INTERFACE
========================= */
export type Validator =
  | { type: "REQUIRE" }
  | { type: "FILE" }
  | { type: "EMAIL" }
  | { type: "MAX_TODAY" }
  | { type: "MIN_TOMORROW" }
  | { type: "MINLENGTH"; val: number }
  | { type: "MAXLENGTH"; val: number }
  | { type: "MIN"; val: number }
  | { type: "MAX"; val: number };

/* =========================
   PART 1 - VALIDATOR CREATORS
========================= */
// part 1 is called in parent component which calls reusable component (NewPlace - parant, Input - reusable etc.)

export const VALIDATOR_REQUIRE = (): Validator => ({
  type: VALIDATOR_TYPE_REQUIRE,
});
export const VALIDATOR_FILE = (): Validator => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_MINLENGTH = (val: number): Validator => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val,
});
export const VALIDATOR_MAXLENGTH = (val: number): Validator => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val,
});
export const VALIDATOR_MIN = (val: number): Validator => ({
  type: VALIDATOR_TYPE_MIN,
  val: val,
});
export const VALIDATOR_MAX = (val: number): Validator => ({
  type: VALIDATOR_TYPE_MAX,
  val: val,
});
export const VALIDATOR_EMAIL = (): Validator => ({
  type: VALIDATOR_TYPE_EMAIL,
});
export const VALIDATOR_MAX_TODAY = (): Validator => ({
  type: VALIDATOR_TYPE_MAX_TODAY,
});
export const VALIDATOR_MIN_TOMORROW = (): Validator => ({
  type: VALIDATOR_TYPE_MIN_TOMORROW,
});

/* =========================
   PART 2 - VALIDATE FUNCTION
========================= */
// part 2 is called in reusable components like 'Input'

export const validate = (
  value: string | number,
  validators: Validator[]
): boolean => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && String(value || "").trim().length > 0;
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && String(value || "").trim().length >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && String(value || "").trim().length <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && +value >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAX) {
      isValid = isValid && +value <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(String(value));
    }
    if (validator.type === VALIDATOR_TYPE_MAX_TODAY) {
      const selectedDate = new Date(value);
      const today = new Date();
      // set time to 0 so only date is compared
      today.setHours(0, 0, 0, 0);
      isValid = isValid && selectedDate <= today;
    }
    if (validator.type === VALIDATOR_TYPE_MIN_TOMORROW) {
      const [y, m, d] = String(value).split("-").map(Number);
      const selectedDate = new Date(y, m - 1, d); // Local date, no timezone shift

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      isValid = isValid && selectedDate >= tomorrow;
    }
  }
  return isValid;
};
