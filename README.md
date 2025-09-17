# Logger & LogProcessor Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive logging library designed for AWS Lambda environments with built-in Datadog integration.

## Features

- 🚀 AWS Context Integration
- 📊 Structured Logging
- 🔍 Log Validation
- 🐶 Datadog Ready
- ⚡ Performance Metrics
- 🛡️ Error Handling

## Installation

```bash
npm install datadog-logger-processor ❌
# or
yarn add datadog-logger-processor ❌
```

### Structure
```bash
logger-datadog-lambda-library/
├── src/
│   ├── logger.ts/
│   └── logProcessor.ts/
│   └── model.ts/
```

## Dependency
```json
{
  "dependencies": {
    "aws-sdk": "^2.1692.0"
  },
  "devDependencies": {
    "@babel/preset-env": "^7.28.0",
    "@babel/preset-typescript": "^7.27.1",
    "@types/jest": "^30.0.0",
    "@types/node": "^18.11.9",
    "jest": "^30.0.5",
    "ts-jest": "^29.4.0",
    "typescript": "^4.9.4"
  }
}
```

## Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "test": "jest --config jest.config.js",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Native Lambda Event Format
The library receives the raw AWS Lambda event and context objects:
```js
// Native Lambda handler signature
exports.handler = async function(event, context) {
  // event: Contains the invocation payload
  // context: Contains runtime information about the Lambda function
  
  // The library processes these native parameters and transforms them
  // into the structured logging format shown below
}
```
The library then transforms the native event and context objects into the structured logging format shown in the example below.


## Example

```json
{
  "timestamp": "2023-11-16T12:34:56.789Z",
  "log_level": "ERROR",
  "service": "payment-service",
  "environment": "production",
  "aws": {
    "region": "us-east-1",
    "account_id": "123456789012",
    "lambda": {
      "function_name": "process-payments",
      "function_version": "$LATEST",
      "memory_size": "1024",
      "cold_start": false,
      "request_id": "c6af9ac6-7b61-11e6-9a41-93e812345678"
    }
  },
  "trace": {
    "trace_id": "1-5f3a1e3b-2c4d6f8a9b0c1d2e3f4g5h6",
    "span_id": "7d8e9f0a1b2c3d4e",
    "xray_segment_id": "079f5c2b1a3d4f5e"
  },
  "error": {
    "type": "PaymentProcessingError",
    "code": "PAY-422",
    "message": "Insufficient funds",
    "stack_trace": "Traceback (most recent call last)..."
  },
  "request": {
    "http": {
      "method": "POST",
      "path": "/v1/payments",
      "query_params": {
        "currency": "USD"
      },
      "headers": {
        "content-type": "application/json",
        "accept": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
        "x-forwarded-for": "203.0.113.1, 70.41.3.12"
      },
      "client_info": {
        "ip_address": "203.0.113.1",
        "public_ip": "203.0.113.1",
        "user_agent": {
          "browser": "Firefox",
          "version": "118.0",
          "os": "Windows 10",
          "device": "Desktop"
        }
      }
    },
    "body": {
      "operation": "process_payment",
      "transaction_id": "txn-789xyz",
      "payment_method": "credit_card",
      "amount": 99.99,
      "currency": "USD",
      "customer_id": "cust-12345"
    }
  },
  "response": {
    "status": "failed",
    "message": "Payment processing failed due to insufficient funds",
    "data": {
      "error_code": "PAY-422",
      "available_balance": 50.00,
      "required_amount": 99.99,
      "suggested_actions": [
        "Try a different payment method",
        "Add funds to your account"
      ],
      "transaction_details": {
        "attempt_id": "att-xyz987",
        "timestamp": "2023-11-16T12:34:56.100Z"
      }
    }
  },
  "performance": {
    "duration_ms": 148.21,
    "billed_duration_ms": 150,
    "max_memory_used_mb": 512,
    "init_duration_ms": 120.45
  },
  "resources": {
    "dynamodb": {
      "table": "PaymentsTable",
      "operation": "PutItem",
      "request_id": "ABCDEFGHIJKLMNOPQRSTUVWXYZ012345"
    },
    "sqs": {
      "queue": "payment-queue",
      "message_id": "msg-123456789"
    }
  },
  "tags": {
    "team": "payments",
    "application": "ecommerce-platform"
  }
}
```