import app from './app';
import {initDb} from './db/connection';

const PORT = process.env.APP_PORT || 3000;

(async () => {
    await initDb();
    app.listen(PORT, () => {
        console.log(`[INFO] Server is running on port ${PORT}`);
    });
})();

