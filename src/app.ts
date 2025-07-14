require('dotenv').config();
import express, {Application} from 'express';
import helmet from 'helmet';
import {RegisterRoutes} from '../build/routes';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/error_handler';
import cors from 'cors';

const app: Application = express();

/*
    Helmet: Helmet is a middleware that helps secure
    Express apps by setting various HTTP headers.

    CORS: CORS (Cross-Origin Resource Sharing) is a security feature
    that allows or restricts resources on a web page to be requested
    from another domain outside the domain from which the first resource was served.

    Express.json: This middleware parses incoming requests with JSON payloads.
    It is based on body-parser and is used to handle JSON data in requests.

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
