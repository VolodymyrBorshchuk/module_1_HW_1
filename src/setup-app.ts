import express, { Express, Request, Response } from 'express';
import { videosRouter } from './drivers/routers/videos.router';
import { testingRouter } from './testing/routers/testing.router';
import { setupSwagger } from './core/swagger/setup-swagger';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('hello world!!!');
  });

  app.use('/hometask_01/api/videos', videosRouter);
  app.use('/hometask_01/api//testing', testingRouter);

  setupSwagger(app);
  return app;
};
