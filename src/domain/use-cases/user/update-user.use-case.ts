import { User } from "../../entities/user"
import { UserRepository } from "../../repositories/user.repository"
import { Role } from "../../../types/role"

export class UpdateUserUseCase {
  private repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async execute(id: number, username?: string, password?: string, rol?: Role) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    if (username) {
      const existingUser = await this.repository.findByUsername(username)
      if (existingUser && existingUser.getId() !== id) {
        throw new Error("El nombre de usuario ya está en uso")
      }
    }

    const updatedUser = new User(
      password || user.getPassword(),
      rol || user.getRol(),
      username || user.getUsername(),
      user.getCreatedAt(),
      user.getDeletedAt(),
      id,
      new Date()
    )

    return await this.repository.update(updatedUser)
  }
}
