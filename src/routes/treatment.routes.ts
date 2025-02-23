import {Router} from "express";
import TreatmentController from "../controller/treatment.controller";
import {
    cancelTreatmentValidator,
    completeTreatmentValidator,
    createTreatmentValidator,
    queryTreatmentValidator,
} from "../dto/treatment.dto";

const treatmentRoutes = Router();
const treatmentController = new TreatmentController();

treatmentRoutes.get("/", queryTreatmentValidator, treatmentController.getTreatments);
treatmentRoutes.post("/", createTreatmentValidator, treatmentController.createTreatment);
treatmentRoutes.patch("/cancel-all-in-progress", treatmentController.cancelAllInProgressTreatments);
treatmentRoutes.patch("/:id/in-progress", treatmentController.takeTreatmentToJob);
treatmentRoutes.patch("/:id/completed", completeTreatmentValidator, treatmentController.completeTreatment);
treatmentRoutes.patch("/:id/cancel", cancelTreatmentValidator, treatmentController.cancelTreatment);

export default treatmentRoutes;
