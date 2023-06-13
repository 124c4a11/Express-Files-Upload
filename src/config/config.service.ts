import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IConfigService } from './config.service.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.service.interface';
import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(TYPES.Logger) private loggserService: ILogger) {
    const result: DotenvConfigOutput = config();

    if (result.error) {
      this.loggserService.error('[ConfigService] Could not read the .env file or is missing');
    } else {
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
