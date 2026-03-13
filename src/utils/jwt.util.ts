import jwt from "jsonwebtoken";

const SECRET_KEY = "tu-secret-key-aqui";

export function generateToken(payload: object) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
}

export function verifyToken(token: string): jwt.JwtPayload {
  return jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
}
