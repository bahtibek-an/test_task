import {DataSource} from "typeorm";
import dotenv from "dotenv";
import {Treatment} from "../entity/treatment.entity"
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT!,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: true,
    logging: true,
    entities: [Treatment],
    subscribers: [],
    migrations: [],
})
