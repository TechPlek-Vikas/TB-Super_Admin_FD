import { useState, useCallback } from "react";/**
 * Custom hook to manage a toggle state.
 *
 * @param {boolean} initialState - The initial state of the toggle (default is `false`).
 * @returns {[boolean, () => void, (value: boolean) => void, (value: boolean) => void]} - An array containing:
 *  - The current state of the toggle.
 *  - A function to toggle the state.
 *  - A function to set the state explicitly with a boolean value.
 *  - A function to update the state with a specific boolean value.
 *
 * @example
 * const [isToggled, toggleState, setToggleState, setStateTo] = useToggle();
 *
 * // Toggle the state
 * toggleState();
 *
 * // Set the state explicitly
 * setToggleState(true);
 *
 * // Update the state with a specific boolean value
 * setStateTo(false);
 */
const useToggle = (initialState = false) => {
  // Initialize the state with the provided initial state
  const [isToggled, setIsToggled] = useState(initialState);

  // Define a function to toggle the state
  const toggleState = useCallback(() => {
    setIsToggled((prevState) => !prevState);
  }, []);

  // Define a function to set the state explicitly
  const setToggleState = useCallback((value) => {
    setIsToggled(value);
  }, []);

  // Return the isToggled state, toggleState function, setToggleState function
  return { isToggled, toggleState, setToggleState };
};

export default useToggle;
