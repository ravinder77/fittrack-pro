import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise) private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  async create(dto: CreateExerciseDto) {
    const existingExercise = await this.exerciseRepository.findOne({
      where: {
        name: dto.name,
      },
    });
    if (existingExercise) {
      throw new BadRequestException('Exercise already exists with this name');
    }
    const exercise = this.exerciseRepository.create(dto);
    return await this.exerciseRepository.save(exercise);
  }

  async findAll() {
    return await this.exerciseRepository.find();
  }

  async findOne(id: string) {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
    });
    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }
    return exercise;
  }

  async update(id: string, dto: UpdateExerciseDto) {
    await this.findOne(id);
    await this.exerciseRepository.update({ id }, dto);
    return await this.findOne(id);
  }

  async delete(id: string) {
    const result = await this.exerciseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }
  }
}
