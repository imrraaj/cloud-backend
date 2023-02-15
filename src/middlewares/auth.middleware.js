import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export async function Authorize(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("You are not authorized to access!!");
    }

    const data = await jwt.verify(token, SECRET_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error({ error });
      res.json({ status: false, message: error.message });
    }
  }
}
