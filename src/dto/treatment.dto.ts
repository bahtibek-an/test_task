import {body, query} from "express-validator";
import {TreatmentStatus} from "../entity/treatment.entity";

export const queryTreatmentValidator = [
    query("date").optional().isISO8601().withMessage("Invalid date"),
    query("startDate").optional().isISO8601().withMessage("Invalid start date format"),
    query("endDate").optional().isISO8601().withMessage("Invalid end date format"),
];

export const createTreatmentValidator = [
    body("text")
        .notEmpty()
        .withMessage("Text of treatment is required")
        .isString()
        .withMessage("Text of treatment must be type string")
        .trim(),
    body("topic")
        .notEmpty()
        .withMessage("Topic is required")
        .isString()
        .withMessage('Topic must be a string')
        .trim(),
];

export const completeTreatmentValidator = [
    body("problem_solving")
        .notEmpty()
        .withMessage("Problem solving is required")
        .isString()
        .withMessage("problem_solving must be type string"),
]


export const cancelTreatmentValidator = [
    body("cancellation_reason")
        .notEmpty()
        .withMessage("cancellation_reason solving is required")
        .isString()
        .withMessage("cancellation_reason must be type string"),
]

export class CreateTreatmentDto {
    text: string;
    topic: string;
    status: TreatmentStatus;
}
