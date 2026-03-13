import { Request, Response } from "express";
import { TypeORMUserRepository } from "../infrastructure/persitence/repositories/typeorm-user.repository";
import { AuthenticateUseCase } from "../domain/use-cases/user/authenticate.use-case";
import { CreateUserUseCase } from "../domain/use-cases/user/create-user.use-case";
import { GetUserUseCase } from "../domain/use-cases/user/get-user.use-case";
import { GetAllUsersUseCase } from "../domain/use-cases/user/get-all-users.use-case";
import { UpdateUserUseCase } from "../domain/use-cases/user/update-user.use-case";
import { DeleteUserUseCase } from "../domain/use-cases/user/delete-user.use-case";
import * as bcrypt from "bcryptjs";

const userRepository = new TypeORMUserRepository();

const authenticateUseCase = new AuthenticateUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

export class UserController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username y password son requeridos" });
      }

      const result = await authenticateUseCase.execute(username, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { username, password, rol } = req.body;

      if (!username || !password || !rol) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await createUserUseCase.execute(username, hashedPassword, rol);
      res.status(201).json({
        id: user.getId(),
        username: user.getUsername(),
        rol: user.getRol()
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await getAllUsersUseCase.execute();
      res.json(users.map(user => ({
        id: user.getId(),
        username: user.getUsername(),
        rol: user.getRol(),
        createdAt: user.getCreatedAt()
      })));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = await getUserUseCase.execute(id);
      res.json({
        id: user.getId(),
        username: user.getUsername(),
        rol: user.getRol(),
        createdAt: user.getCreatedAt()
      });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { username, password, rol } = req.body;

      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

      const user = await updateUserUseCase.execute(id, username, hashedPassword, rol);
      res.json({
        id: user.getId(),
        username: user.getUsername(),
        rol: user.getRol()
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await deleteUserUseCase.execute(id);
      res.json({ message: "Usuario eliminado" });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}
