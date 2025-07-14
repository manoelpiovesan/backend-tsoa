import {Sequelize} from 'sequelize-typescript';

const dbUser = process.env.DB_USER || 'admin';
const dbPass = process.env.DB_PASS || 'password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || 'backend_tsoa';
const dbKind = process.env.DB_KIND || 'postgres';

const dbUrl = `${dbKind}://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;

export const sequelize = new Sequelize(dbUrl, {
    models: [__dirname + '/../models'],
    modelMatch: (_filename, member) => {
        return member !== 'default';

    },
});

export const initDb = async () => {
    try {
        await sequelize.sync();
        console.log('[SUCCESS] Database synchronized successfully.');
    } catch (err) {
        console.error('[ERROR] Unable to synchronize the database:', err);
    }
};