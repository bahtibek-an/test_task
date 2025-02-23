import express from "express";
import cors from "cors";
import "reflect-metadata";
import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);
app.use(errorMiddleware);

export default app;
