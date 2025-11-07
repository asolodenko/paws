export const Female = 'Female'
export const Male = 'Male'

type Gender = 'Female' | 'Male';

type ThreeLevel = 'moderate' | 'low' | 'high';

type HealthCondition = 'healthy' | 'underweight' | 'overweight' | 'dental issues';

export interface Paw {
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