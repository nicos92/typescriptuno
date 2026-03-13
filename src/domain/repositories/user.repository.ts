import { User } from "../entities/user";

export interface UserRepository {
  findAll(): Promise<User[]>;
  findAllWithDeleted(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  softDelete(id: number): Promise<void>;
}
