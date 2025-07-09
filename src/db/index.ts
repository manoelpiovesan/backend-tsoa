import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.POSTGRES_URL || '');

export const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida.');
    } catch (err) {
        console.error('Erro ao conectar no banco:', err);
    }
};
