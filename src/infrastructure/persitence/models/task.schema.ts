import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import { UserSchema } from "./user.schema";

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

    @Column({ nullable: true })
    userId: number;

    @ManyToOne(() => UserSchema, { nullable: true })
    @JoinColumn({ name: "userId" })
    user: UserSchema;

    @DeleteDateColumn()
    deletedAt: Date;
}
