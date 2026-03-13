import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class TaskSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: false })
    completed: boolean;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}
