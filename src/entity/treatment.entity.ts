import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export enum TreatmentStatus {
    NEW = "NEW",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

@Entity()
export class Treatment {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'text'})
    public text: string;

    @Column({type: 'varchar', length: 255})
    public topic: string;

    @Column({type: 'text', nullable: true})
    public problem_solving?: string;

    @Column({type: "text", nullable: true})
    public cancellation_reason?: string;

    @Column({type: "enum", enum: TreatmentStatus, default: TreatmentStatus.NEW})
    public status: TreatmentStatus;

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public created_at: Date;

    @UpdateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
    public updated_at: Date;
}
