import {Router} from "express";
import treatmentRoutes from "./treatment.routes";

const routes = Router();

routes.use("/treatments", treatmentRoutes);

export default routes;
