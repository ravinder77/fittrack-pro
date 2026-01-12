import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsNumber()
  @Min(50)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  weight?: number;

  @IsOptional()
  @IsString()
  fitnessGoal?: string;
}
