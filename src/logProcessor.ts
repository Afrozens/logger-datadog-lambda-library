import { Logger } from "./logger";

export class LogProcessor {
  private static instance: LogProcessor | undefined = undefined;
  private logger = Logger.getInstance();

  /**
   * Gets the singleton instance of the LogProcessor
   * @returns {LogProcessor} The LogProcessor instance
   */
  public static getInstance(): LogProcessor {
    if (!this.instance) {
      this.instance = new LogProcessor();
    }
    return this.instance;
  }

}