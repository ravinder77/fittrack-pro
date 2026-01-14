import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User with this id does not exist');
    }

    return this.mapProfile(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.userRepository.update(userId, dto);
    return this.getProfile(userId);
  }

  private mapProfile(user: User) {
    const bmi =
      user.height && user.weight ? (user.weight / (user.height / 100) ** 2).toFixed(2) : null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      height: user.height,
      weight: user.weight,
      fitnessGoal: user.fitnessGoal,
      bmi: bmi,
    };
  }
}
