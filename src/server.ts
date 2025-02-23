import {AppDataSource} from "./config/db.config";
import app from "./app";
import dotenv from "dotenv";
import http from "node:http";

const PORT = process.env.PORT || 5000;
dotenv.config();
const httpServer = http.createServer(app);

;(async () => {
    try {
        await AppDataSource.initialize();
        httpServer.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        });
    } catch (e) {
        console.error(e);
    }
})();
