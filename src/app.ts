import 'reflect-metadata';
import express, { Express, json } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger/logger.service.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { PrismaService } from './database/prisma.service';
import { IFilesController } from './domains/files/controller/files.controller.interface';

@injectable()
export class App {
  app: Express;
  port: number;
  server: Server;

  constructor(
    @inject(TYPES.Logger) private loggerService: ILogger,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
    @inject(TYPES.FilesController) private filesController: IFilesController,
  ) {
    this.app = express();
    this.port = 8000;
  }

  useMiddleware(): void {
    this.app.use(json());
  }

  useRoutes(): void {
    this.app.use('/files', this.filesController.router);
  }

  useExceptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  async init(): Promise<void> {
    this.useMiddleware();
    this.useRoutes();
    this.useExceptionFilters();

    await this.prismaService.connect();

    this.server = this.app.listen(this.port);

    this.loggerService.log(`✨ Server is running on http://localhost:${this.port} 🚀`);
  }
}
