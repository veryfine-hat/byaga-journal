function hrDuration(): () => number {
  const startTime = process.hrtime();
  const onEnd = function duration() {
    const hrTime = process.hrtime(startTime);
    return hrTime[0] * 1000 + hrTime[1] / 1000000;
  };
  onEnd.time = startTime;

  return onEnd;
}

function lrDuration(): () => number {
    const startTime = Date.now();
    const onEnd = function duration() {
        return Date.now() - startTime;
    };
    onEnd.time = startTime;

    return onEnd;
}

export function duration(): () => number {
  // @ts-ignore
    return process.hrtime ? hrDuration() : lrDuration();
}