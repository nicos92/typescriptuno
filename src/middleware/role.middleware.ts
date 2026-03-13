import { Response, NextFunction } from "express"
import { AuthRequest } from "./auth.middleware"
import { Role } from "../types/role"

export function roleMiddleware(allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" })
    }

    if (!allowedRoles.includes(req.user.rol as Role)) {
      return res.status(403).json({ message: "No tienes permiso" })
    }

    next()
  }
}
