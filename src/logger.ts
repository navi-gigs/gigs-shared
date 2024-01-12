import winston, { Logger } from 'winston';
import {
  ElasticsearchTransformer,
  ElasticsearchTransport,
  LogData,
  TransformedData,
} from 'winston-elasticsearch';

// Wiston is the logger which has support for many transporter, eg: Console, Elasticsearch, cloudwatch... think transporter as a destination source

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
};

export const winstonLogger = (
  elasticsearchNode: string, // Elastic search url
  name: string,
  level: string
): Logger => {
  const options = {
    // We are telling that when logging to console, use this settings
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true,
    },

    // When logging to elasticsearch use this settings.
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false,
      },
    },
  };

  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [
      new winston.transports.Console(options.console),
      new ElasticsearchTransport(options.elasticsearch),
    ],
  });
  return logger;
};
