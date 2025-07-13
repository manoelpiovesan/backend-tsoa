require('dotenv').config();
import express, {Application, Request, Response, NextFunction} from 'express';
import helmet from 'helmet';
import {RegisterRoutes} from '../build/routes';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

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
const swaggerDocument = require(path.resolve(__dirname, '../build/swagger.json'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.status && err.message) {
        res.status(err.status).json({message: err.message});
    } else {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

export default app;
