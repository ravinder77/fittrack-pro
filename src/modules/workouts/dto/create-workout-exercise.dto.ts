import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateWorkoutExerciseDto {
  @IsUUID()
  exerciseId: string;

  @IsInt()
  @Min(1)
  sets: number;

  @IsInt()
  @Min(1)
  reps: number;

  @IsOptional()
  @IsInt()
  weight?: number;

  @IsInt()
  @Min(1)
  order: number;
}
