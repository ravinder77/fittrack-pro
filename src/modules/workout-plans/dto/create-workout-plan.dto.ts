import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutPlanDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
