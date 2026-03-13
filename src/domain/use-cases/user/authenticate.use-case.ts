import * as bcrypt from "bcryptjs";
import { User } from "../../entities/user";
import { UserRepository } from "../../repositories/user.repository";
import { generateToken } from "../../../utils/jwt.util";

export class AuthenticateUseCase {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async execute(username: string, password: string) {
    const user = await this.repository.findByUsername(username);
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const isPasswordValid = await bcrypt.compare(password, user.getPassword());
    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas");
    }

    const token = generateToken({
      id: user.getId()!,
      username: user.getUsername(),
      rol: user.getRol(),
    });

    return {
      user: {
        id: user.getId(),
        username: user.getUsername(),
        rol: user.getRol(),
      },
      token,
    };
  }
}
