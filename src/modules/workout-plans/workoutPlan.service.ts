import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';
import { Repository } from 'typeorm';
import { WorkoutPlan } from './entities/workoutPlan.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(WorkoutPlan)
    private readonly workoutPlanRepository: Repository<WorkoutPlan>,
  ) {}

  async create(dto: CreateWorkoutPlanDto) {
    // check if plan with same name exists
    const existingWorkoutPlan = await this.workoutPlanRepository.findOneBy({
      name: dto.name,
    });
    if (existingWorkoutPlan) {
      throw new BadRequestException('Workout Plan with same name already exists');
    }
    const plan = this.workoutPlanRepository.create(dto);
    await this.workoutPlanRepository.save(plan);
  }

  //--------- READ-----
  async findAll() {
    return await this.workoutPlanRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const plan = await this.workoutPlanRepository.findOne({
      where: { id },
    });
    if (!plan) {
      throw new BadRequestException('Workout Plan does not exist');
    }
    return plan;
  }

  //------- UPDATE -------
  async update(id: string, dto: UpdateWorkoutPlanDto) {
    await this.findOne(id);
    await this.workoutPlanRepository.update({ id }, dto);
    return this.findOne(id);
  }

  // -------DELETE ---------
  async delete(id: string): Promise<void> {
    const result = await this.workoutPlanRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Workout Plan does not exist');
    }
  }
}
