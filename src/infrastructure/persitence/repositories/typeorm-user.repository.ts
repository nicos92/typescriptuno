import { User } from "../../../domain/entities/user";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { AppDataSource } from "../config/data-source";
import { UserSchema } from "../models/user.schema";

export class TypeORMUserRepository implements UserRepository {
  private repository = AppDataSource.getRepository(UserSchema);

  async findAll(): Promise<User[]> {
    const usersData = await this.repository.find();
    return usersData.map((data) => this.mapToEntity(data));
  }

  async findAllWithDeleted(): Promise<User[]> {
    const usersData: UserSchema[] = await this.repository.find({
      withDeleted: true,
    });

    return usersData.map((data) => this.mapToEntity(data));
  }

  async findById(id: number): Promise<User | null> {
    const userData = await this.repository.findOneBy({
      id,
    });

    if (!userData) {
      return null;
    }

    return this.mapToEntity(userData);
  }

  async findByUsername(username: string): Promise<User | null> {
    const userData: UserSchema = await this.repository.findOneBy({ username });

    if (!userData) {
      return null;
    }

    return this.mapToEntity(userData);
  }

  async create(user: User): Promise<User> {
    const newUser = await this.repository.save({
      username: user.getUsername(),
      password: user.getPassword(),
      rol: user.getRol(),
      createdAt: user.getCreatedAt(),
      modifiedAt: user.getModifiedAt(),
      deletedAt: user.getDeletedAt(),
    });

    return this.mapToEntity(newUser);
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.repository.save({
      id: user.getId(),
      username: user.getUsername(),
      password: user.getPassword(),
      rol: user.getRol(),
      createdAt: user.getCreatedAt(),
      modifiedAt: user.getModifiedAt(),
      deletedAt: user.getDeletedAt(),
    });

    return this.mapToEntity(updatedUser);
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  private mapToEntity(data: UserSchema): User {
    return new User(
      data.password,
      data.rol,
      data.username,
      data.createdAt,
      data.deletedAt,
      data.id,
      data.modifiedAt,
    );
  }
}
