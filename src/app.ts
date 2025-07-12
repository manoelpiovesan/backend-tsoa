import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { RegisterRoutes } from '../build/routes';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

RegisterRoutes(app);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.status && err.message) {
        res.status(err.status).json({ message: err.message });
    } else {
        console.error(err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

export default app;

