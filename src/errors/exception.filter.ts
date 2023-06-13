import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.service.interface';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(TYPES.Logger) private loggserService: ILogger) {}

  catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof HTTPError) {
      this.loggserService.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);

      res.status(err.statusCode).send({ err: err.message });

      return;
    }

    this.loggserService.error(`${err.message}`);
    res.status(500).send({ err: err.message });
  }
}
