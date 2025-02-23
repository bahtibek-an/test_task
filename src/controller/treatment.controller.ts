import {NextFunction, Response, Request} from "express";
import RequestWithBody from "../interfaces/RequstWithBody.interface";
import {CreateTreatmentDto} from "../dto/treatment.dto";
import ApiError from "../exceptions/api.error.exception";
import {validationResult} from "express-validator";
import TreatmentService from "../services/treatment.service";
import {Treatment, TreatmentStatus} from "../entity/treatment.entity";
import {AppDataSource} from "../config/db.config";


class TreatmentController {
    private readonly treatmentService: TreatmentService;

    constructor() {
        const treatmentRepository = AppDataSource.getRepository(Treatment);
        this.treatmentService = new TreatmentService(treatmentRepository);
    }

    public getTreatments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Validation error", errors.array());
            }
            const {date, startDate, endDate} = req.query;
            const treatments = await this.treatmentService.getTreatments(date as string, startDate as string, endDate as string);
            return res.status(200).json(treatments);
        } catch (e) {
            next(e);
        }
    }

    public createTreatment = async (req: RequestWithBody<CreateTreatmentDto>, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("error", errors.array());
            }
            const {text, topic} = req.body;
            const treatment = await this.treatmentService.createTreatment({
                text,
                topic,
                status: TreatmentStatus.NEW,
            });
            return res.status(201).json(treatment);
        } catch (e) {
            next(e);
        }
    }

    public takeTreatmentToJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            const treatment = await this.treatmentService.updateTreatmentStatusToInProgress(+id);
            return res.status(200).json(treatment);
        } catch (e) {
            next(e);
        }
    }

    public completeTreatment = async (req: RequestWithBody<{
        problem_solving: string
    }>, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("error", errors.array());
            }
            const {id} = req.params;
            const {problem_solving} = req.body;
            const treatment = await this.treatmentService.updateTreatmentStatusToCompleted(+id, problem_solving);
            return res.status(200).json(treatment);
        } catch (e) {
            next(e);
        }
    }

    public cancelTreatment = async (req: RequestWithBody<{
        cancellation_reason: string
    }>, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("error", errors.array());
            }
            const {id} = req.params;
            const {cancellation_reason} = req.body;
            const treatment = await this.treatmentService.updateTreatmentStatusToCancelled(+id, cancellation_reason);
            return res.status(200).json(treatment);
        } catch (e) {
            next(e);
        }
    }

    public cancelAllInProgressTreatments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const treatments = await this.treatmentService.cancelAllInProgress();
            return res.status(200).json(treatments);
        } catch (e) {
            next(e);
        }
    }

}

export default TreatmentController;
