import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { TYPES } from './types';
import { ILogger } from './logger/logger.service.interface';
import { LoggerService } from './logger/logger.service';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ExceptionFilter } from './errors/exception.filter';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { FilesController } from './domains/files/controller/files.controller';
import { IFilesController } from './domains/files/controller/files.controller.interface';
import { FilesService } from './domains/files/service/files.service';
import { IFilesService } from './domains/files/service/files.service.interface';

interface IBootstrap {
  app: App;
  appContainer: Container;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App).inSingletonScope();
  bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();

  bind<IFilesController>(TYPES.FilesController).to(FilesController).inSingletonScope();
  bind<IFilesService>(TYPES.FilesService).to(FilesService).inSingletonScope();
});

export async function bootstrap(): Promise<IBootstrap> {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);

  await app.init();

  return { app, appContainer };
}

export const boot = bootstrap();
