import {
  Column,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkoutPlan } from './workoutPlan.entity';
import { Exercise } from './exercise.entity';

export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => WorkoutPlan)
  plan: WorkoutPlan;

  @ManyToMany(() => Exercise)
  @JoinTable()
  exercises: Exercise[];
}
