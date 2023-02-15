import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;

export async function signToken(payload) {
  const token = await jwt.sign(payload, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "2h",
  });
  return token;
}
