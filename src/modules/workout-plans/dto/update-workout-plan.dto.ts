import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWorkoutPlanDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
