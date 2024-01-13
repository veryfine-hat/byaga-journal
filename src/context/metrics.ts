import {duration} from '../duration';
import {getContextValue, setContextValue} from "./context";
import {annotate} from './annotate';

/**
 * Increments a value in the context by a specified amount.
 *
 * @param {string} name - The name of the context item.
 * @param {number} [add=1] - The amount to increment by. Defaults to 1.
 * @returns {number} - The new value of the context item.
 */
export const sum = (name: string, add: number = 1): number => {
    const key: string = `sum.${name}`
    return setContextValue(key, (getContextValue(key) as number || 0) + add) as number
}
sum.key = (name: string):string => `sum.${name}`
sum.reset = (name: string): void => {setContextValue(sum.key(name), 0)}

/**
 * Increments a value in the context by a specified amount and logs the total.
 *
 * @param {string} name - The name of the context item.
 * @param {number} [add=1] - The amount to increment by. Defaults to 1.
 */
export const total = (name: string, add: number = 1) => {
    annotate(`metrics.${name}_ct`, sum(total.key(name), add))
}
total.key = (name: string):string => `total.${name}`
/// Reset the total
/// NOTE: this will not clear any annotations it only resets the context values so that the next total will start from 0
total.reset = (name: string): void => sum.reset(total.key(name));

/**
 * Starts a timer and returns a function that stops the timer when called.
 * The timer duration is added to a value in the context and logged.
 *
 * @param name - The name of the context item.
 * @returns A function that stops the timer when called.
 */
export const startTimer = (name: string) => {
    const end = duration();
    let once = true;
    return () => {
        if (!once) throw new Error('Done method should only be called once');

        once = false;
        total(startTimer.countKey(name));

        const totalDuration = sum(startTimer.durationKey(name), end());
        annotate(`metrics.${name}_total_dur_ms`, totalDuration);
    }
}
startTimer.countKey = (name: string):string => `${name}_call`
startTimer.durationKey = (name: string):string => `timer.${name}_dur_ms`
/// Reset the timer count and duration
/// NOTE: this will not clear any annotations it only resets the context values so that the next timer will start from 0
startTimer.reset = (name: string): void => {
    total.reset(startTimer.countKey(name));
    sum.reset(startTimer.durationKey(name));
}