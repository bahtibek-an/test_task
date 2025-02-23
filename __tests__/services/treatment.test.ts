import {Repository} from "typeorm";
import TreatmentService from "../../src/services/treatment.service";
import {Treatment, TreatmentStatus} from "../../src/entity/treatment.entity";

describe('TreatmentService', () => {
    let treatmentService: TreatmentService;
    let mockRepo: jest.Mocked<Repository<Treatment>>;

    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            createQueryBuilder: jest.fn(),
            update: jest.fn(),
        } as any;
        treatmentService = new TreatmentService(mockRepo);
    });

    it("should create a treatment", async () => {
        const treatment = {
            id: 1,
            topic: "Test",
            text: "Treatment text",
            status: TreatmentStatus.NEW,
        } as any;
        mockRepo.save.mockResolvedValue(treatment);
        const result = await treatmentService.createTreatment(treatment);
        expect(result).toEqual(treatment);
    });

    it("should take treatment in progress", async () => {
        const treatment = {
            id: 1,
            topic: "Test",
            text: "Treatment text",
            status: TreatmentStatus.NEW,
            cancellation_reason: null,
            problem_solving: null
        } as any;
        const treatmentId = 1;
        mockRepo.findOneBy.mockResolvedValue(treatment);
        mockRepo.save.mockResolvedValue({...treatment, status: TreatmentStatus.IN_PROGRESS});

        const result = await treatmentService.updateTreatmentStatusToInProgress(treatmentId);
        expect(mockRepo.findOneBy).toHaveBeenCalledWith({id: treatmentId});
        expect(result.status).toEqual(TreatmentStatus.IN_PROGRESS);
    });

    it("should change treatment status to COMPLETED", async () => {
        const problemSolving = "Test problemSolving";
        const treatment = {
            id: 1,
            topic: "Test",
            text: "Treatment text",
            status: TreatmentStatus.IN_PROGRESS,
            cancellation_reason: null,
            problem_solving: problemSolving
        } as any;
        const treatmentId = 1;
        mockRepo.findOneBy.mockResolvedValue(treatment);
        mockRepo.save.mockResolvedValue({...treatment, status: TreatmentStatus.COMPLETED});

        const result = await treatmentService.updateTreatmentStatusToCompleted(treatmentId, problemSolving);
        expect(mockRepo.findOneBy).toHaveBeenCalledWith({id: treatmentId});
        expect(result.status).toEqual(TreatmentStatus.COMPLETED);
        expect(result.problem_solving).toEqual(problemSolving);
    });

    it("should change treatment status to CANCELLED", async () => {
        const cancellationReason = "Test cancellationReason";
        const treatment = {
            id: 1,
            topic: "Test",
            text: "Treatment text",
            status: TreatmentStatus.IN_PROGRESS,
            cancellation_reason: cancellationReason,
            problem_solving: null
        } as any;
        const treatmentId = 1;

        mockRepo.findOneBy.mockResolvedValue(treatment);
        mockRepo.save.mockResolvedValue({...treatment, status: TreatmentStatus.CANCELED});

        const result = await treatmentService.updateTreatmentStatusToCancelled(treatmentId, cancellationReason);
        expect(mockRepo.findOneBy).toHaveBeenCalledWith({id: treatmentId});
        expect(result.status).toEqual(TreatmentStatus.CANCELED);
        expect(result.cancellation_reason).toEqual(cancellationReason);
    });

    it("should get treatments with specific date", async () => {
        const mockTreatments = [
            {
                id: 1,
                topic: "Test",
                text: "Treatment text",
                status: TreatmentStatus.IN_PROGRESS,
                cancellation_reason: "",
                problem_solving: null,
                createdAt: new Date("2025-02-23T15:37:10.002Z"),
            },
            {
                id: 1,
                topic: "Test",
                text: "Treatment text",
                status: TreatmentStatus.IN_PROGRESS,
                cancellation_reason: "",
                problem_solving: null,
                createdAt: new Date("2025-02-23T19:00:00.002Z")
            }
        ];

        mockRepo.createQueryBuilder.mockReturnValue({
            getMany: jest.fn().mockReturnValue(mockTreatments),
            where: jest.fn(),
        } as any);

        const treatments = await treatmentService.getTreatments("2025-02-23");
        expect(treatments).toEqual(mockTreatments);
    });

    it("should cancel all treatments with status IN_PROGRESS", async () => {
        const expectedValue = {
            generatedMaps: [],
            raw: [],
            affected: 2
        };
        mockRepo.update.mockResolvedValue(expectedValue);
        const updatedResult = await treatmentService.cancelAllInProgress();
        expect(updatedResult).toEqual(expectedValue);
    });
});
