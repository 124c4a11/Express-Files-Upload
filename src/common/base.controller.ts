import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.service.interface';
import { ExpressReturnType, IControllerRoute } from './route.interface';

@injectable()
export abstract class BaseController {
  private _router: Router;

  constructor(private logger: ILogger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  send<TMessage>(res: Response, status: number, message: TMessage): ExpressReturnType {
    res.type('application/json');
    return res.status(status).json(message);
  }

  ok<TMessage>(res: Response, message: TMessage): ExpressReturnType {
    return this.send(res, 200, message);
  }

  created(res: Response): ExpressReturnType {
    return res.status(201);
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    routes.forEach(({ method, path, func, middlewares }) => {
      this.logger.log(`[${method}] ${path}`);

      const execMiddlewares = middlewares?.map((m) => m.execute.bind(m));
      const handler = func.bind(this);
      const pipeline = execMiddlewares ? [...execMiddlewares, handler] : handler;

      this.router[method](path, pipeline);
    });
  }
}
