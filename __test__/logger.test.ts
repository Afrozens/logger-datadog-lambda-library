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

  describe('log()', () => {
    it('should log with timestamp and message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      logger.log('Test message');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/));
      expect(consoleSpy).toHaveBeenCalledWith('Test message');
    });
  });

  describe('getInstance()', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = Logger.getInstance();
      const instance2 = Logger.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('setLambdaContext()', () => {
    it('should set the Lambda context', () => {
      const mockContext = { functionName: 'testFn' };
      logger.setLambdaContext(mockContext);
      expect(logger['lambdaContext']).toEqual(mockContext);
    });
  });

  describe('error()', () => {
    it('should log error without stack trace when no error is provided', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      logger.error('Test error');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"ERROR"')
      );
    });
  });

  describe('getAwsContext()', () => {
    it('should throw if Lambda context is not set', () => {
      logger.setLambdaContext(undefined)
      expect(() => logger.getAwsContext()).toThrow('Lambda context not set');
    });

    it('should return correct AWS context when Lambda context is set', () => {
      const mockContext = {
        functionName: 'testFn',
        functionVersion: '1',
        memoryLimitInMB: '256',
        awsRequestId: '123',
        invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:testFn'
      };
      process.env.AWS_REGION = 'us-east-1';
      logger.setLambdaContext(mockContext);

      const result = logger.getAwsContext();
      expect(result.region).toBe('us-east-1');
      expect(result.account_id).toBe('123456789012');
      expect(result.lambda.function_name).toBe('testFn');
    });
  });
});