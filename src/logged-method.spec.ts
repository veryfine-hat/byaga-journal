import loggedMethod from './logged-method'
import {Context, journal} from './index';

const write: jest.Mock<any, any, any> = jest.fn();
journal.configure({
  write
});

let startTimerSpy: jest.SpyInstance;
let exceptionSpy: jest.SpyInstance;
let stopTimer = jest.fn()
beforeEach(() => {
  jest.clearAllMocks();
  startTimerSpy = jest.spyOn(Context, 'startTimer');
  startTimerSpy.mockReturnValue(stopTimer);
    exceptionSpy = jest.spyOn(Context, 'exception');
})
afterAll(() => {
  startTimerSpy.mockReset();
  exceptionSpy.mockReset();
})
// jest.mock('./index', () => {
//   const logger = {
//     stopTimer: jest.fn(),
//     startTimer: jest.fn(name => () => logger.stopTimer(name, 'pass')),
//     exception: jest.fn()
//   };
//   return logger;
// })

it('should add a timer around the method call', async () => {
  const fn = jest.fn();
  const wrapped = loggedMethod('test-method', fn);

  await wrapped('test param');

  expect(startTimerSpy).toHaveBeenCalledWith('test-method');
  expect(stopTimer).toHaveBeenCalled();
});

it('should catch any exceptions thrown by the method', async () => {
  const fn = jest.fn();
  fn.mockRejectedValue('Bang!!!');
  const wrapped = loggedMethod('test-method', fn);

  await wrapped('test param');

  expect(exceptionSpy).toHaveBeenCalledWith('Bang!!!');
});

it('should forward any input arguments to the method', async () => {
  const fn = jest.fn();
  const wrapped = loggedMethod('test-method', fn);

  await wrapped('test param', '1', '2', '3');

  expect(fn).toHaveBeenCalledWith('test param', '1', '2', '3');
});
