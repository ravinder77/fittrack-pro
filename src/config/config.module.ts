import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './env.validation';
import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';

const env = process.env.NODE_ENV ?? 'development';
const isProduction = env === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidationSchema,
      envFilePath: isProduction ? undefined : [`.env.${env}`, '.env'],
      load: [appConfig, databaseConfig, jwtConfig],
    }),
  ],
})
export class AppConfigModule {}
