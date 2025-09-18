import { AwsContext } from "./model";

export class Logger {
  private static instance: Logger | undefined = undefined;
  private lambdaContext: any;

  private constructor() {}

  /**
   * Gets the singleton instance of the Logger
   * @returns {Logger} The Logger instance
   */
  public static getInstance(): Logger {
    if (!this.instance) {
      this.instance = new Logger();
    }
    return this.instance;
  }

  /**
   * Sets the AWS Lambda context for the logger
   * @param {any} context - The AWS Lambda context object
   * @returns {void}
   */
  public setLambdaContext(context: any): void {
    this.lambdaContext = context;
  }

  /**
   * Logs a message with timestamp and optional parameters
   * @param {string} log - The message to log
   * @param {...any} params - Additional parameters to log
   * @returns {void}
   */
  public log(log: string, ...params: any[]): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}]`);

    if (params.length > 0) {
      console.log(log, ...params);
    } else {
      console.log(log);
    }
  }

  /**
   * Logs an error message with optional error details and context
   * @param {string} message - The error message
   * @param {Error} [error] - Optional Error object with details
   * @param {any} [context] - Optional additional context data
   * @returns {void}
   */
  public error(message: string, error?: Error, context?: any): void {
    const timestamp = new Date().toISOString();

    const logData = {
      level: 'ERROR',
      timestamp,
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined,
      context
    };
    console.error(JSON.stringify(logData));
  }
  
  /**
   * Gets the AWS context information including region, account and Lambda details
   * @returns {AwsContext} The AWS context information
   * @throws {Error} When Lambda context is not set
   */
  public getAwsContext(): AwsContext {
    if (!this.lambdaContext) {
      throw new Error('Lambda context not set');
    }

    return {
      region: process.env.AWS_REGION,
      account_id: this.lambdaContext.invokedFunctionArn.split(':')[4],
      lambda: {
        function_name: this.lambdaContext.functionName,
        function_version: this.lambdaContext.functionVersion,
        memory_size: this.lambdaContext.memoryLimitInMB,
        cold_start: this.lambdaContext.coldStart !== undefined 
          ? this.lambdaContext.coldStart 
          : true,
        request_id: this.lambdaContext.awsRequestId
      }
    };
  }
}