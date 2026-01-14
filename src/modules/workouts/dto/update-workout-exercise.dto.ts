import { IsInt, IsOptional } from 'class-validator';

export class UpdateWorkoutExercise {
  @IsInt()
  exerciseId: number;

  @IsInt()
  @IsOptional()
  sets: number;

  @IsInt()
  @IsOptional()
  reps: number;

  @IsInt()
  @IsOptional()
  order: number;
}
