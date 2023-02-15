import { z } from "zod";
const loginData = z.object({
  username: z
    .string({
      required_error: "Username is required!",
    })
    .trim()
    .min(3, { message: "Must be 3 or more characters long" }),
  password: z.string({ required_error: "Password is required!" }).trim(),
});

function parseLogin(body) {
  return loginData.safeParse(body);
}
function parseSignup(body) {
  return signupData.safeParse(body);
}

const signupData = z.object({
  name: z.string(),
  username: z
    .string({
      required_error: "Username is required!",
    })
    .trim()
    .min(3, { message: "Must be 3 or more characters long" }),
  password: z.string().trim(),
  email: z.string().email({
    message: "Email is required!",
  }),
});

export { parseLogin, parseSignup };
