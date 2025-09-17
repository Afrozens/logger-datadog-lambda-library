import { LogProcessor } from '../src/logProcessor';

jest.mock('../src/logger');

describe('LogProcessor', () => {
  let logProcessor = LogProcessor.getInstance();

  beforeEach(() => {
    logProcessor = LogProcessor.getInstance();
    jest.clearAllMocks();
  });
});