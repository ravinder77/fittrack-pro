import { Module } from '@nestjs/common';
import { WorkoutPlanService } from './workoutPlan.service';
import { WorkoutPlanController } from './workoutPlan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlan } from './entities/workoutPlan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutPlan])],
  providers: [WorkoutPlanService],
  controllers: [WorkoutPlanController],
})
export class WorkoutPlanModule {}
