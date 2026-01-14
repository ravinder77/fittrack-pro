import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { WorkoutPlanService } from './workoutPlan.service';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';

@Controller('workout-plans')
export class WorkoutPlanController {
  constructor(private readonly workoutPlanService: WorkoutPlanService) {}

  @Post('')
  create(@Body() createWorkoutPlanDto: CreateWorkoutPlanDto) {
    return this.workoutPlanService.create(createWorkoutPlanDto);
  }

  @Get(':id')
  findOnePlanById(@Param('id') id: string) {
    return this.workoutPlanService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkoutPlanDto) {
    return this.workoutPlanService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.workoutPlanService.delete(id);
  }
}
