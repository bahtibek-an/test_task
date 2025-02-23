import {Repository} from "typeorm";
import {CreateTreatmentDto} from "../dto/treatment.dto";
import ApiError from "../exceptions/api.error.exception";
import dotenv from "dotenv";
import {Treatment, TreatmentStatus} from "../entity/treatment.entity";

dotenv.config();

class TreatmentService {
    private readonly treatmentRepository: Repository<Treatment>;

    constructor(treatmentRepository: Repository<Treatment>) {
        this.treatmentRepository = treatmentRepository;
    }

    public createTreatment(treatment: CreateTreatmentDto): Promise<Treatment> {
        return this.treatmentRepository.save(treatment);
    }

    public async updateTreatmentStatusToInProgress(treatmentId: number) {
        const treatment = await this.treatmentRepository.findOneBy({
            id: treatmentId,
        });
        if (!treatment) {
            throw ApiError.BadRequest("Treatment not found");
        }
        return this.treatmentRepository.save({
            ...treatment,
            status: TreatmentStatus.IN_PROGRESS,
        });
    }

    public async updateTreatmentStatusToCompleted(treatmentId: number, problemSolving: string) {
        const treatment = await this.treatmentRepository.findOneBy({
            id: treatmentId,
        });
        if (!treatment) {
            throw ApiError.BadRequest("Treatment not found");
        }
        return this.treatmentRepository.save({
            ...treatment,
            status: TreatmentStatus.COMPLETED,
            problemSolving,
        });
    }

    public async updateTreatmentStatusToCancelled(treatmentId: number, cancellationReason: string) {
        const treatment = await this.treatmentRepository.findOneBy({
            id: treatmentId,
        });
        if (!treatment) {
            throw ApiError.NotFoundError();
        }
        return this.treatmentRepository.save({
            ...treatment,
            status: TreatmentStatus.CANCELED,
            cancellation_reason: cancellationReason,
        });
    }

    public async getTreatments(date?: string, startDate?: string, endDate?: string) {
        const queryBuilder = this.treatmentRepository.createQueryBuilder("treatment");
        if (date) {
            queryBuilder.where("DATE(treatment.created_at) = :date", {date});
        }
        if (startDate && endDate) {
            queryBuilder.where("treatment.created_at BETWEEN :startDate AND :endDate", {
                startDate: startDate,
                endDate: endDate
            });
        }

        return queryBuilder.getMany();
    }

    public async cancelAllInProgress() {
        return this.treatmentRepository.update({
            status: TreatmentStatus.IN_PROGRESS
        }, {
            status: TreatmentStatus.CANCELED,
            cancellation_reason: "Cancelled all IN PROGRESS"
        });
    }

}

export default TreatmentService;
