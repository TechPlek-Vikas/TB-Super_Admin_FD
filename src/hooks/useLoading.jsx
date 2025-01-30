import { useState, useCallback } from "react";/**
 * Custom hook for managing loading state.
 *
 * @returns {Object} An object containing:
 * - `isLoading`: A boolean indicating whether the operation is in progress.
 * - `updateLoading`: A function to set the loading state directly (true or false).
 * - `startLoading`: A function to set the loading state to true.
 * - `stopLoading`: A function to set the loading state to false.
 * - `withLoading`: A higher-order function that wraps an async operation and automatically manages the loading state.
 */
const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Updates the loading state directly.
   *
   * @param {boolean} value - The boolean value to set the loading state (true or false).
   */
  const updateLoading = useCallback((value) => {
    setIsLoading(value);
  }, []);

  /**
   * Sets the loading state to true.
   */
  const startLoading = useCallback(() => {
    updateLoading(true);
  }, [updateLoading]);

  /**
   * Sets the loading state to false.
   */
  const stopLoading = useCallback(() => {
    updateLoading(false);
  }, [updateLoading]);

  /**
   * Wraps an async operation and automatically manages the loading state.
   *
   * @param {Function} asyncFn - The async function to be executed.
   * @returns {Promise} A promise that resolves when the async operation is complete.
   */
  const withLoading = useCallback(
    async (asyncFn) => {
      try {
        startLoading();
        const result = await asyncFn();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    updateLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

export default useLoading;
