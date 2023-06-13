import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IControllerRoute {
  path: string;
  method: keyof Pick<Router, 'post' | 'get' | 'put' | 'patch' | 'delete'>;
  func: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
