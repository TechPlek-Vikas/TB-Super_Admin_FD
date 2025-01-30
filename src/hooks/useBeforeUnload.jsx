import { useEffect } from "react";/**
 * Custom hook to handle the `beforeunload` event.
 * Displays a browser-inbuilt alert when the user attempts to leave the page.
 *
 * @param {boolean} enabled - Whether the `beforeunload` behavior should be enabled. Defaults to `true`.
 */
const useBeforeUnload = (enabled = true) => {
  useEffect(() => {
    // If the hook is disabled, do nothing
    if (!enabled) return;

    /**
     * Handler for the `beforeunload` event.
     * Prevents the default behavior and triggers a browser alert.
     *
     * @param {Event} event - The `beforeunload` event object.
     */
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      // Chrome requires `returnValue` to be set to trigger the alert
      event.returnValue = "";
    };

    // Add the event listener for the `beforeunload` event
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]); // Re-run the effect if the `enabled` value changes
};

export default useBeforeUnload;
