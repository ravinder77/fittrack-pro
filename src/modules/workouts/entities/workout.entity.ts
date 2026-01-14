import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkoutPlan } from '../../workout-plans/entities/workoutPlan.entity';
import { WorkoutExercise } from './workoutExercise.entity';

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => WorkoutPlan, (plan) => plan.workouts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workoutPlanId' })
  plan: WorkoutPlan;

  @OneToMany(() => WorkoutExercise, (we) => we.workout, {
    cascade: true,
  })
  workoutExercises: WorkoutExercise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
