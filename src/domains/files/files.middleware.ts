import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../../common/middleware.interface';
import multer from 'multer';

export class FilesMiddleware implements IMiddleware {
  execute: (req: Request, res: Response, next: NextFunction) => void;

  constructor() {
    this.execute = multer().array('files');
  }
}
