export enum Gender {
  Female = 'Female',
  Male = 'Male'
}

enum ThreeLevel {
  Moderate = 'moderate',
  Low = 'low',
  High = 'high'
}

enum HealthCondition {
  Healthy = 'healthy',
  Underweight = 'underweight',
  Overweight = 'overweight',
  DentalIssues = 'dental issues'
}

export type Paw = {
  id: string;
  img: string;
  name: string;
  gender: Gender;
  breed: string;
  birthDate: string;
  weight: string;
  coatColor: string;
  temperament: string;
  groomingNeeds: ThreeLevel;
  activityLevel: ThreeLevel;
  foodFlavor: string;
  toyType: string;
  healthCondition: HealthCondition;
}