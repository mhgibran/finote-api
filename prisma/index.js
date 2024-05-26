const { PrismaClient } = require("@prisma/client");
const softDeleteMiddleware = require("../src/middlewares/softDeleteMiddleware");
const prisma = new PrismaClient();
prisma.$use(softDeleteMiddleware);
module.exports = prisma;
