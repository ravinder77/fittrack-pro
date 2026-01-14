import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workout } from '../../workouts/entities/workout.entity';

export enum PlanLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum PlanGoal {
  MUSCLE = 'muscle',
  FAT_LOSS = 'fat_loss',
  STRENGTH = 'strength',
}

@Entity('workout_plans')
export class WorkoutPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: PlanLevel,
  })
  level: PlanLevel;

  @Column({
    type: 'enum',
    enum: PlanGoal,
  })
  goal: PlanGoal;

  @Column()
  durationWeeks: number;

  @OneToMany(() => Workout, (workout) => workout.plan, {
    cascade: true,
  })
  workouts: Workout[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
