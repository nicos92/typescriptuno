import { Role, ROLES_VALUES } from "../../types/role"

export class User {
  private id?: number
  private username: string
  private password: string
  private rol: Role
  private createdAt: Date
  private modifiedAt: Date
  private deletedAt: Date | null

  constructor(
    password: string,
    rol: Role,
    username: string,
    createdAt?: Date,
    deletedAt?: Date | null,
    id?: number,
    modifiedAt?: Date,
  ) {
    if (!username) {
      throw new Error("El nombre de usuario es obligatorio")
    }
    if (!password || password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres")
    }
    if (!ROLES_VALUES.includes(rol)) {
      throw new Error("Rol inválido")
    }

    this.id = id;
    this.username = username;
    this.password = password;
    this.rol = rol;
    this.createdAt = createdAt || new Date();
    this.modifiedAt = modifiedAt || new Date();
    this.deletedAt = deletedAt || null;
  }

  public getId() {
    return this.id;
  }

  public getUsername() {
    return this.username;
  }

  public getPassword() {
    return this.password;
  }

  public getRol(): Role {
    return this.rol
  }

  public getCreatedAt() {
    return this.createdAt;
  }

  public getModifiedAt() {
    return this.modifiedAt;
  }

  public getDeletedAt() {
    return this.deletedAt;
  }

  public isDeleted() {
    return this.deletedAt !== null;
  }

  public activate() {
    this.deletedAt = null;
  }

  public deactivate() {
    this.deletedAt = new Date();
  }
}
