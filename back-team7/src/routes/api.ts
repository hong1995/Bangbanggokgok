import { Router } from 'express';
import { userRouter, feedRouter, reviewRouter } from './api/';
import { loginRequired } from '../middlewares';
const apiRouter = Router();

// apiRouter.use('/users', loginRequired, userRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/feeds', /*feedRequired,*/ feedRouter);
apiRouter.use('/reviews', /*reviewRequired,*/ reviewRouter);

export { apiRouter };
