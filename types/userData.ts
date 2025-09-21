export interface UserData {
  id?: string;
  name: string;
  email: string;
  sex?: "male" | "female" | null; 
    age: number; // in years
  weight: number; // in kg
  height: number; // in cm
}