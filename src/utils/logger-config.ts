import log4js from 'log4js';

const DEFAULT_APPENDERS =
  process.env.NODE_ENV === 'production'
    ? {appenders: ['file'], level: 'info'}
    : {appenders: ['stdout', 'file'], level: 'debug'};

interface LoggerConfig {
  filename?: string;
  maxLogSize: number;
  backups?: number;
  keepFileExt: boolean;
  compress: boolean;
}

export function configure(
  config: LoggerConfig = {
    filename: `${process.env.LOG4JS_DIR}/${process.env.LOG4JS_FILENAME}`,
    maxLogSize: Number(process.env.LOG4JS_MAX_LOG_SIZE) || 10485760,
    backups: Number(process.env.LOG4JS_BACKUPS) || 99,
    keepFileExt: true,
    compress: false,
  },
) {
  log4js.configure({
    appenders: {
      stdout: {type: 'stdout'},
      file: {
        type: 'file',
        filename: config.filename,
        maxLogSize: config.maxLogSize,
        backups: config.backups,
        keepFileExt: config.keepFileExt,
        compress: config.compress,
      },
    },
    categories: {
      default: DEFAULT_APPENDERS,
    },
  });
}

export function getLogger(category: string) {
  return log4js.getLogger(category);
}
