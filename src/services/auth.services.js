// all the db calls and all the returning without checkings
import { prisma } from "../db/index";

async function getAll() {
  return await prisma.post.findMany();
}
async function getUser(username) {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;
}
async function createUser({ password, username }) {
  const user = await prisma.user.create({
    data: {
      password,
      username,
    },
  });
  return user;
}
async function changePassword({ password, username }) {
  const user = await prisma.user.update({
    where: { username },
    data: {
      password,
    },
  });
  return user;
}
export { getAll, getUser, createUser, changePassword };
