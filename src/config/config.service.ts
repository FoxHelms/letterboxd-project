import * as path from 'path';
import { ConfigService as _ConfigService, Path } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface Config {
  app: {
    host: string | undefined;
    port: number;
    nodeEnv: string;
    throwIfNoVitalConfig: boolean;
  };
  database: {
    name: string;
    password: string | undefined;
    url: string;
    useSsl: any;
    username: string | undefined;
  };
}

export class ConfigService extends _ConfigService<Config, true> {
  get<P extends Path<Config>>(path: P) {
    const value = super.get(path, { infer: true });
    return value;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    const config: TypeOrmModuleOptions = {
      type: 'postgres',

      autoLoadEntities: true,

      url: this.get('database.url'),

      ssl: this.get('database.useSsl'),

      entities: [path.join(__dirname, '../**', '*.entity.{ts,js}')],

      migrationsTableName: 'migration',

      migrations: [path.join(__dirname, '../../migrations/*.ts')],

      logging: Boolean(process.env.ENABLE_DB_LOGGING),
    };

    return config;
  }
}
