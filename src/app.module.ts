import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { WorkoutPlanModule } from './modules/workout-plans/workoutPlan.module';
import { ExercisesController } from './modules/exercises/exercises.controller';
import { ExercisesModule } from './modules/exercises/exercises.module';

@Module({
  imports: [
    AppConfigModule,
    HealthModule,
    AuthModule,
    DatabaseModule,
    UsersModule,
    WorkoutsModule,
    WorkoutPlanModule,
    ExercisesModule,
  ],
  providers: [],
  controllers: [AuthController, ExercisesController],
})
export class AppModule {}
