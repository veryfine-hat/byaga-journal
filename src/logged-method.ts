import Journal from './index'

export const loggedMethod = (name: string, fn: Function): Function => {
  return async (...args: any[]) => {
    const done = Journal.startTimer(name)
    try {
      return await fn(...args);
    } catch (error) {
      Journal.exception(error);
      return { error };
    } finally {
     done();
    }
  }
}

export default loggedMethod;