import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import { config } from '../config/index.js';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const cert = config.digitalOcean.dbCert;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: true,
    ca: cert,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
