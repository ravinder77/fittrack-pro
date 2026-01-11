import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AppConfigModule, HealthModule, AuthModule, DatabaseModule],
  providers: [],
  controllers: [AuthController],
})
export class AppModule {}
