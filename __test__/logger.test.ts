import { Logger } from '../src/logger';

describe('Logger', () => {
  let logger = Logger.getInstance();

  beforeEach(() => {
    logger = Logger.getInstance();
    jest.spyOn(Logger, 'getInstance').mockImplementation(() => logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});