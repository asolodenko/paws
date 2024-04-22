enum Gender {
  Female,
  Male
}

enum GroomingNeeds {
  moderate,
  low,
  high
}

enum ActivityLevel {
  moderate,
  low,
  high
}

enum HealthCondition {
  healthy,
  underweight,
  overweight,
  'dental issues'
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
  groomingNeeds: GroomingNeeds;
  activityLevel: ActivityLevel;
  foodFlavor: string;
  toyType: string;
  healthCondition: HealthCondition
}