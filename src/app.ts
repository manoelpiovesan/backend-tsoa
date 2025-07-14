import {keycloakConfig} from "./utils/keycloak_config";

require('dotenv').config();
import express, {Application} from 'express';
import helmet from 'helmet';
import {RegisterRoutes} from '../build/routes';
import swaggerUi from 'swagger-ui-express';
import {errorHandler} from './middlewares/error_handler';
import cors from 'cors';
import session from 'express-session';
import Keycloak from 'keycloak-connect';

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
    Session Management: This middleware is used to manage user sessions.
    It stores session data on the server side and uses cookies to identify
    the session on the client side.
 */
const sessionStore = new session.MemoryStore();
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    },
    store: sessionStore
}))

/*
    Keycloak Configuration
 */
const keycloak = new Keycloak({
    store: sessionStore
}, keycloakConfig);
app.use(keycloak.middleware());

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
