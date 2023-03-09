const loggedMethod = require('./logged-method');
const Journal = require('./index');

jest.mock('./index', () => {
  const logger = {
    stopTimer: jest.fn(),
    startTimer: jest.fn(name => () => logger.stopTimer(name, 'pass')),
    exception: jest.fn()
  };
  return logger;
})

it('should add a timer around the method call', async () => {
  const fn = jest.fn();
  const wrapped = loggedMethod('test-method', fn);

  await wrapped('test param');

  expect(Journal.stopTimer).toHaveBeenCalledWith('test-method', 'pass');
});

it('should catch any exceptions thrown by the method', async () => {
  const fn = jest.fn();
  fn.mockRejectedValue('Bang!!!');
  const wrapped = loggedMethod('test-method', fn);

  await wrapped('test param');

  expect(Journal.exception).toHaveBeenCalledWith('Bang!!!');
});

it('should forward any input arguments to the method', async () => {
  const fn = jest.fn();
  const wrapped = loggedMethod('test-method', fn);

  await wrapped('test param', '1', '2', '3');

  expect(fn).toHaveBeenCalledWith('test param', '1', '2', '3');
});
