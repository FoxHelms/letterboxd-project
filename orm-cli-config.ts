import { DataSource } from 'typeorm';
import * as path from 'path';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const env = dotenv.config({ path: path.resolve(__dirname, '.', '.env.local') });
dotenvExpand.expand(env);

const ssl_config = process.env.DATABASE_USE_SSL
  ? { rejectUnauthorized: false }
  : false;

export default new DataSource({
  type: 'postgres',
  connectTimeoutMS: 3000,
  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: ['./migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  ssl: ssl_config,
  url: process.env.DATABASE_URL,
});