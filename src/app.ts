require('dotenv').config();
import express, {Application, Request, Response, NextFunction} from 'express';
import helmet from 'helmet';
import {RegisterRoutes} from '../build/routes';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { errorHandler } from './middlewares/error_handler';

const cors = require('cors');

const app: Application = express();

/*
    Helmet: Helmet is a middleware that helps secure
    Express apps by setting various HTTP headers.
 */
app.use(helmet());
app.use(cors());
app.use(express.json());

/*
    Swagger Configuration
 */
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(
    require('../../build/swagger.json'),
    {
        swaggerOptions: {
            url: '/swagger.json',
        },
    }
))

RegisterRoutes(app);

app.use(errorHandler);

export default app;
