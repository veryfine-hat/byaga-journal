import {duration} from '../duration';
import { annotate } from './annotate';

/**
 * Starts a timer and returns a function that stops the timer when called.
 * The timer duration is logged with a specified key.
 *
 * @param {string} [name] - Optional. The name to be used for the key of the logged duration. If not provided, 'duration_ms' is used.
 * @returns {Function} - A function that stops the timer when called. The function logs the timer duration with the specified key.
 * @throws {Error} - If the returned function is called more than once.
 */
export const startTimer = (name?: string) => {
  const end = duration();
  let once = true;
  return () => {
    if (!once) throw new Error('Done method should only be called once');

    once = false;
    const key = name ? `metrics.${name}_dur_ms` : 'duration_ms'
    annotate({ [key]: end() });
  }
}