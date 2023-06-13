import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../../common/middleware.interface';
import multer from 'multer';

export class UploadMiddleware implements IMiddleware {
  execute: (req: Request, res: Response, next: NextFunction) => void;

  constructor() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads/'),
      filename: (req, file, cb) => cb(null, file.originalname),
    });

    this.execute = multer({ storage }).array('files');
  }
}
