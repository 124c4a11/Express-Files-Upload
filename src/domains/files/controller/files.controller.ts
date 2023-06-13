import { inject, injectable } from 'inversify';
import { BaseController } from '../../../common/base.controller';
import { TYPES } from '../../../types';
import { ILogger } from '../../../logger/logger.service.interface';
import { NextFunction, Request, Response } from 'express';
import { IFilesController } from './files.controller.interface';
import { IFilesService } from '../service/files.service.interface';
import { UploadMiddleware } from '../upload.middleware';

@injectable()
export class FilesController extends BaseController implements IFilesController {
  constructor(
    @inject(TYPES.Logger) private readonly loggerService: ILogger,
    @inject(TYPES.FilesService) private readonly filesService: IFilesService,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/upload',
        method: 'post',
        func: this.upload,
        middlewares: [new UploadMiddleware()],
      },
    ]);
  }

  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req);

      this.ok(res, 'Ok');
    } catch (err) {
      next(err);
    }
  }
}
