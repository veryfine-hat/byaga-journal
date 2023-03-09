module.exports = () => {
  const startTime = process.hrtime ? process.hrtime() : Date.now();
  const onEnd = function duration() {
    if (process.hrtime) {
      const hrTime = process.hrtime(startTime);
      return hrTime[0] * 1000 + hrTime[1] / 1000000;
    }
    return Date.now() - startTime;
  };
  onEnd.time = startTime;

  return onEnd;
};