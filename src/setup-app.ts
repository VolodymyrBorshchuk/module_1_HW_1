import express, { Express, Request, Response } from 'express';
import { videosRouter } from './drivers/routers/drivers.router';
import { testingRouter } from './testing/routers/testing.router';
import { setupSwagger } from './core/swagger/setup-swagger';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('hello world!!!');
  });

  app.use('/api/drivers', videosRouter);
  app.use('/api/testing', testingRouter);

  setupSwagger(app);
  return app;
};
