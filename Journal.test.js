const Logger = require("./Journal");

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log');
});

afterEach(() => {
    console.log.mockReset();
});

it('should allow the write method to be overridden', () => {
    const logger = new Logger();
    const write = jest.fn();
    logger.configure({ write });
    logger.log({ message: 'test' });
    expect(write).toHaveBeenCalledWith({ message: 'test' });
});

it('should allow logs to be written', () => {
    const logger = new Logger();

    logger.log({ message: 'test' });
    expect(console.log).toHaveBeenCalledWith({ message: 'test' });
});

it('should allow annotations to be added to future log calls', () => {
    const logger = new Logger();
    logger.annotate({ some: 'data' });
    logger.log({ message: 'test' });
    expect(console.log)
      .toHaveBeenCalledWith({
          message: 'test',
          some: 'data'
      });
});

it('should allow annotations to be overwritten', () => {
    const logger = new Logger();
    logger.annotate({ some: 'data' });
    logger.annotate({ some: 'updated-data' });
    logger.log({ message: 'test' });
    expect(console.log)
      .toHaveBeenCalledWith({
          message: 'test',
          some: 'updated-data'
      });
});

it('should overwrite annotations with an data passed to log', () => {
    const logger = new Logger();
    logger.annotate({ some: 'data' });
    logger.log({
        message: 'test',
        some: 'updated-data'
    });
    expect(console.log)
      .toHaveBeenCalledWith({
          message: 'test',
          some: 'updated-data'
      });
});

it('should allow annotations to be added to child loggers without affecting the parent', () => {
    const logger = new Logger();
    const child = logger.beginSpan();
    child.annotate({ child: 'data' });
    logger.log({ message: 'test' });
    expect(console.log).toHaveBeenCalledWith({ message: 'test' });
});

it('should include parent annotations in child loggers', () => {
    const logger = new Logger();
    logger.annotate({ parent: 'data' });
    const child = logger.beginSpan();
    child.end({ message: 'test' });
    expect(console.log)
      .toHaveBeenCalledWith(expect.objectContaining({
          message: 'test',
          parent: 'data'
      }));
});

it('should include child annotations in child loggers', () => {
    const logger = new Logger();
    const child = logger.beginSpan();
    child.annotate({ child: 'data' });
    child.end({ message: 'test' });
    expect(console.log)
      .toHaveBeenCalledWith(expect.objectContaining({
          message: 'test',
          child: 'data'
      }));
});

it('should allow setting root annotations through a child logger', () => {
    const logger = new Logger();
    logger.annotate({ parent: 'data' });
    const child = logger.beginSpan();
    child.annotate({ child: 'data' }, 1);
    logger.log({ message: 'test' });
    expect(console.log)
      .toHaveBeenCalledWith({
          message: 'test',
          parent: 'data',
          child: 'data'
      });
});

it('should allow timing blocks of code', () => {
    const logger = new Logger();
    const stop = logger.startTimer({ timer: 'data' });
    expect(console.log).not.toHaveBeenCalled();
    stop({ end: 'data' });
    expect(console.log)
      .toHaveBeenCalledWith({
          timer: 'data',
          end: 'data',
          'duration_ms': expect.any(Number)
      });
});

it('should add parent context to child even if set after child is created', () => {
    const logger = new Logger();
    const child = logger.beginSpan();

    logger.annotate({ more: 'data' });
    child.end({ message: 'test' });
    expect(console.log)
      .toHaveBeenCalledWith(expect.objectContaining({
          message: 'test',
          more: 'data',
      }));
});

it('should send a log when a child span is ended', () => {
    const logger = new Logger();
    const child = logger.beginSpan();

    expect(console.log).not.toHaveBeenCalled();
    child.end({ message: 'test' });
    expect(console.log)
      .toHaveBeenCalledWith(expect.objectContaining({
          message: 'test'
      }));
});

it('should attach exception details to the end log', () => {
    const logger = new Logger();
    const child = logger.beginSpan();

    expect(console.log).not.toHaveBeenCalled();
    try {
        throw new Error('Bang!!!');
    } catch (e) {
        child.exception(e, { detail: 'Test worked' });
    }

    child.end({ 'message': 'complete' });
    expect(console.log)
      .toHaveBeenCalledWith(expect.objectContaining({
          message: 'complete',
          'error.stack': expect.any(String),
          'error.message': 'Bang!!!',
          'error.detail': 'Test worked'
      }));
});

it('should convert a string log param to an object with a message property', () => {
    const logger = new Logger();

    logger.log('A Message Here');

    expect(console.log)
      .toHaveBeenCalledWith({
          message: 'A Message Here'
      });
});

it('should concatenate params into the message param if 1st param is a string', () => {
    const logger = new Logger();

    logger.log('A', 'Message', "Here");

    expect(console.log)
      .toHaveBeenCalledWith({
          message: 'A Message Here'
      });
});

it('should convert a string log param to an object with a message property when ending child spans', () => {
    const logger = new Logger();
    const child = logger.beginSpan();
    child.end('A', 'Message', "Here");

    expect(console.log)
      .toHaveBeenCalledWith(expect.objectContaining({
          message: 'A Message Here'
      }));
});

it('should convert a string log param to an object with a message property when creating child spans', () => {
    const logger = new Logger();
    const child = logger.beginSpan('A', 'Message', "Here");
    child.end();

    expect(console.log)
      .toHaveBeenCalledWith(expect.objectContaining({
          message: 'A Message Here'
      }));
});

it('should allow a child logger to be initialized with annotations', () => {
    const logger = new Logger();
    const child = logger.beginSpan({
        child: 'data'
    });
    child.end('end');

    expect(console.log)
      .toHaveBeenCalledWith(expect.objectContaining({
          child: 'data',
          message: 'end'
      }));
});

it('should add a duration_ms property to logs created when a span is ended', () => {
    const logger = new Logger();
    const child = logger.beginSpan({
        child: 'data'
    });
    child.end('end');

    expect(console.log)
      .toHaveBeenCalledWith(expect.objectContaining({
          duration_ms: expect.any(Number)
      }));
});

it('should allow recording timers as a named metric on child span', async () => {
    const logger = new Logger();
    const child = logger.beginSpan()
    const result = await child.time(() => Promise.resolve({ more: 'data' }), 'test_log');
    child.end({ message: 'data' });
    expect(result).toEqual({ more: 'data' });
    expect(console.log)
      .toHaveBeenCalledWith(expect.objectContaining({
          message: 'data',
          'metrics.timers.test_log_ms': expect.any(Number),
      }));
});

it('should allow wrapping an async method call in a named span', async () => {
    const logger = new Logger();
    await logger.span(() => new Promise(resolve => {
        setTimeout(() => resolve(), 0);
    }), "onTestExecuted");

    expect(console.log).toHaveBeenCalledWith(expect.objectContaining({
        message: 'onTestExecuted',
        duration_ms: expect.any(Number)
    }));
});

it('should return the method call result when wrapping with a span', async () => {
    const logger = new Logger();
    const result = await logger.span(() => new Promise(resolve => {
        setTimeout(() => resolve('some-return'), 0);
    }), "onTestExecuted");

    expect(result).toEqual('some-return');
});

it('should pass the created span into the wrapped method', async () => {
    const logger = new Logger();
    await logger.span((span) => new Promise(resolve => {
        span.annotate({ extra: 'data' });
        setTimeout(() => resolve(), 0);
    }), "onTestExecuted");

    expect(console.log).toHaveBeenCalledWith(expect.objectContaining({
        extra: 'data'
    }));
});
