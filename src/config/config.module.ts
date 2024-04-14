import { Module } from '@nestjs/common';
import { ConfigModule as _ConfigModule } from '@nestjs/config';
import { Config, ConfigService } from './config.service';

const { env } = process;

@Module({
    imports: [
      _ConfigModule.forRoot({
        envFilePath:'.env.local',
        load: [
          () => {
            const nodeEnv = env.NODE_ENV || 'staging';
            const config: Config = {
              app: {
                host: env.HOST,
                port: env.PORT ? parseInt(env.PORT, 10) : 3000,
                nodeEnv,
                throwIfNoVitalConfig: nodeEnv === 'production',
              },
              database: {
                name: env.DATABASE_NAME || '',
                password: env.DATABASE_PASSWORD,
                url: env.DATABASE_URL || '',
                username: env.DATABASE_USERNAME,
                useSsl: env.DATABASE_USE_SSL
                  ? { rejectUnauthorized: false }
                  : false,
              }
            };
  
            return config;
          },
        ],
      }),
    ],
    providers: [ConfigService],
    exports: [ConfigService],
  })
  export class ConfigModule {}