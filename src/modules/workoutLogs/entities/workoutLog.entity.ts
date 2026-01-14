import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workout } from '../../workouts/entities/workout.entity';
import { User } from '../../users/entities/user.entity';

export class WorkoutLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Workout)
  workout: Workout;

  @Column()
  duration: number;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  caloriesBurned?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
