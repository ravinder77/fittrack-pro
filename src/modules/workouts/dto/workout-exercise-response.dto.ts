export class WorkoutExerciseResponseDto {
  id: string;
  sets: number;
  reps: number;
  weight?: number;
  order: number;

  exercise: {
    id: string;
    name: string;
  };
}
