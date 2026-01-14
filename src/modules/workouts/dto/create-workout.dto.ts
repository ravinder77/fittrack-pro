export class CreateWorkoutDto {
  name: string;
  workoutPlanId: string;
  exercises: {
    exerciseId: string;
    sets?: number;
    reps?: number;
    duration?: number;
    order: number;
  }[];
}
