import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MuscleGroup } from '../entities/exercise.entity';

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(MuscleGroup)
  muscleGroup?: MuscleGroup;

  @IsOptional()
  @IsString()
  equipment?: string;
}
