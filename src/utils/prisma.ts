import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { config } from '../config/index.js';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({
  connectionString,
  ssl: { rejectUnauthorized: true, ca: config.digitalOcean.dbCert },
});
const prisma = new PrismaClient({ adapter });

export { prisma };
