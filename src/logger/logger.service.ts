import { ILogObj, Logger } from 'tslog';
import { ILogger } from './logger.service.interface';
import { injectable } from 'inversify';

@injectable()
export class LoggerService implements ILogger {
  logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger({ type: 'pretty', hideLogPositionForProduction: true });
  }

  log(...args: unknown[]): void {
    this.logger.info(...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }

  error(...args: unknown[]): void {
    this.logger.error(...args);
  }
}
