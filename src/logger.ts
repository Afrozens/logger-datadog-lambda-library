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
  
}