import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt.util"
import { Role } from "../types/role"

export interface AuthRequest extends Request {
  user?: {
    id: number
    username: string
    rol: Role
  }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      rol: decoded.rol
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
