import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  rol: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "datetime", nullable: true })
  modifiedAt: Date;

  @Column({ type: "datetime", nullable: true })
  deletedAt: Date;
}
