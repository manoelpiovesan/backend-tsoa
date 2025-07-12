import { Sequelize } from 'sequelize';

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbKind = process.env.DB_KIND || 'postgres';

const dbUrl = `${dbKind}://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;

export const sequelize = new Sequelize(dbUrl);

export const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database successfully.');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};