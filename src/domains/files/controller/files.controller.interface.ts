import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../../common/base.controller';

export interface IFilesController extends BaseController {
  upload: (req: Request, res: Response, next: NextFunction) => void;
}
