
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


async function createUser({ data }) {
  return prisma.user.create({ data });
}

async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

module.exports = {
  createUser,
  getUserByEmail,
  prisma,
};
