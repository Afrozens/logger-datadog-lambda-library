import { Logger } from "./logger";
import { DatadogLog, LogEntry } from "./model";

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


  /**
   * Verifies and parses a log entry, validating required fields
   * @param {string|object} log - The log to verify (can be string or object)
   * @returns {LogEntry} The parsed and validated log entry
   * @throws {Error} When log is invalid or missing required fields
   */
  public verifyAndParse(log: string | object): LogEntry {
    try {
      const parsedLog = typeof log === 'string' ? JSON.parse(log) : log;

      const requiredFields = ['timestamp', 'service'];
      const missingFields = requiredFields.filter(field => !parsedLog[field]);

      if (missingFields.length > 2) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      return parsedLog as LogEntry;
    } catch (error) {
      this.logger?.error('Failed to verify and parse log', error as Error, { log });
      throw error;
    }
  }

  /**
   * Adapts a partial log entry to standard format, filling missing fields
   * @param {Partial<LogEntry>} logEntry - The partial log entry to adapt
   * @param {any} lambdaContext - AWS Lambda context object
   * @returns {LogEntry} The complete log entry in standard format
   * @throws {Error} When adaptation fails
   */
  public adaptToStandardFormat(
    logEntry: Partial<LogEntry>, 
    lambdaContext: any
  ): LogEntry {
    try {
      this.logger?.setLambdaContext(lambdaContext);

      const awsContext = this.logger?.getAwsContext();
      const now = new Date().toISOString();

      const standardLog: LogEntry = {
        timestamp: logEntry.timestamp || now,
        log_level: logEntry.log_level || 'INFO',
        service: logEntry.service || 'unknown-service',
        environment: logEntry.environment || process.env.ENVIRONMENT || 'dev',
        aws: awsContext,
        trace: logEntry.trace || {
          trace_id: '',
          span_id: '',
          xray_segment_id: ''
        },
        request: logEntry.request,
        response: logEntry.response,
        resources: logEntry.resources,
        tags: {
          ...(logEntry.tags || {}),
          dd: {
            env: process.env.DD_ENV || 'dev',
            service: process.env.DD_SERVICE || 'aws',
            version: process.env.DD_VERSION || 'unknown'
          }
        }
      };

      if (!logEntry.performance) {
        standardLog.performance = {
          duration_ms: 0,
          billed_duration_ms: 0,
          max_memory_used_mb: 0,
          init_duration_ms: 0
        };
      } else {
        standardLog.performance = logEntry.performance;
      }

      return standardLog;
    } catch (error) {
      console.log(error)
      this.logger?.error('Failed to adapt log to standard format', error as Error);
      throw error;
    }
  }

  /**
   * Prepares a log entry for Datadog by converting it to Datadog format
   * @param {LogEntry} logEntry - The log entry to prepare
   * @returns {DatadogLog} The log in Datadog format
   * @throws {Error} When conversion fails
   */
  public prepareForDatadog(logEntry: LogEntry): DatadogLog {
    try {
      const ddTags = [
        `env:${logEntry.environment}`,
        `service:${logEntry.service}`,
        `aws_region:${logEntry.aws.region}`,
        `function_name:${logEntry.aws.lambda.function_name}`,
        ...Object.entries(logEntry.tags || {}).map(([key, value]) => `${key}:${value}`)
      ].join(',');

      return {
        message: JSON.stringify(logEntry),
        ddsource: 'aws',
        ddtags: ddTags,
        service: logEntry.service,
        host: logEntry.aws.lambda.function_name,
        timestamp: logEntry.timestamp,
        log: {
          level: logEntry.log_level,
          aws: logEntry.aws,
          trace: logEntry.trace,
          performance: logEntry.performance
        }
      };
    } catch (error) {
      this.logger.error('Failed to prepare log for Datadog', error as Error);
      throw error;
    }
  }
}