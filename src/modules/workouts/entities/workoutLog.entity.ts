import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Workout } from './workout.entity';
import { User } from '../../users/entities/user.entity';

export class WorkoutLog {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Workout)
  workout: Workout;

  @Column()
  duration: number;

  @Column({ default: false })
  completed: boolean;
}
