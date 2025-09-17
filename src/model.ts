export interface AwsLambda {
    function_name: string;
    function_version: string;
    memory_size: number;
    cold_start: boolean;
    request_id: string;
}

export interface AwsContext {
  region?: string;
  account_id?: string;
  lambda: AwsLambda
}

export interface TraceContext {
  trace_id: string;
  span_id: string;
  xray_segment_id: string;
}

export interface PerformanceMetrics {
  duration_ms: number;
  billed_duration_ms: number;
  max_memory_used_mb: number;
  init_duration_ms: number;
}

export interface LogEntryError {
    type: string;
    code: string;
    message: string;
    stack_trace?: string;
}

export interface LogEntry {
  timestamp: string;
  log_level: string;
  service: string;
  environment: string;
  aws: AwsContext;
  trace?: TraceContext;
  request: any;
  response: any;
  resources?: any;
  tags?: any;
  performance?: PerformanceMetrics;
  error?: LogEntryError
}

export interface DatadogLog {
  message: string;
  ddsource: string;
  ddtags: string;
  service: string;
  host: string;
  timestamp: string;
  [key: string]: any;
}
