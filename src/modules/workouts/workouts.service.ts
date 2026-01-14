import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { Workout } from './entities/workout.entity';
import { WorkoutExercise } from './entities/workoutExercise.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { WorkoutPlan } from '../workout-plans/entities/workoutPlan.entity';

@Injectable()
export class WorkoutsService {
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    @InjectRepository(WorkoutPlan)
    private readonly workoutPlanRepository: Repository<WorkoutPlan>,
    @InjectRepository(WorkoutExercise)
    private readonly workoutExerciseRepository: Repository<WorkoutExercise>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  async createWorkout(dto: CreateWorkoutDto) {
    return this.datasource.transaction(async (manager) => {
      // Validate Workout Plan
      const workoutPlan = await manager.findOne(WorkoutPlan, {
        where: {
          id: dto.workoutPlanId,
        },
      });
      if (!workoutPlan) {
        throw new NotFoundException('Workout does not exist');
      }

      // Create Workout
      const workout = manager.create(Workout, {
        name: dto.name,
        workoutPlan,
      });
      await manager.save(workout);

      // Validate Exercises
      const exercisesIds = dto.exercises.map((exercise) => exercise.exerciseId);
      const exercises = await manager.findBy(Exercise, {
        id: In(exercisesIds),
      });

      if (exercises.length !== exercisesIds.length) {
        throw new BadRequestException('One or more exercises are invalid or missing');
      }

      const exerciseMap = new Map(exercises.map((exercise) => [exercise.id, exercise]));
      console.log(exerciseMap);

      // Create Workout Exercises
      const workoutExercises = dto.exercises.map((ex) => {
        manager.create(WorkoutExercise, {
          workout,
          exercise: exerciseMap.get(ex.exerciseId),
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          order: ex.order,
        });
      });
      await manager.save(workoutExercises);

      // return full workout
      return manager.findOne(Workout, {
        where: { id: workout.id },
        relations: {
          workoutExercises: {
            exercise: true,
          },
        },
      });
    });
  }
}
