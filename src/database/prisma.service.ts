import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.service.interface';

@injectable()
export class PrismaService {
  client: PrismaClient;

  constructor(@inject(TYPES.Logger) private logger: ILogger) {
    this.client = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.log('[PrismaService] DB connected!');
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`[PrismaService] ${err.message}!`);
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
