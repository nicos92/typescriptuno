import "reflect-metadata";
import { AppDataSource } from "./infrastructure/persitence/config/data-source";
import { TypeORMUserRepository } from "./infrastructure/persitence/repositories/typeorm-user.repository";
import * as bcrypt from "bcryptjs";
import { User } from "./domain/entities/user";

async function seed() {
  await AppDataSource.initialize();

  const repository = new TypeORMUserRepository();
  const existingAdmin = await repository.findByUsername("admin");

  if (existingAdmin) {
    console.log("El usuario admin ya existe");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminUser = new User(hashedPassword, "admin", "admin");

  await repository.create(adminUser);
  console.log("Usuario admin creado correctamente");
  console.log("Username: admin");
  console.log("Password: admin123");

  process.exit(0);
}

seed().catch((error) => {
  console.error("Error al crear el seed:", error);
  process.exit(1);
});
