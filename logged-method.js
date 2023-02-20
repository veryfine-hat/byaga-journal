const Journal = require('./index')
const loggedMethod = (name, fn) => {
  return async (...args) => {
    const done = Journal.startTimer(name)
    try {
      return await fn(...args);
    } catch (error) {
      Journal.exception(error);
      return { error };
    } finally {
      done()
    }
  }
}

module.exports = loggedMethod