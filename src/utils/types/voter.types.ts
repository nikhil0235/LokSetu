export interface Voter {
  id: string;
  name: string;
  age: number;
  address: string;
  phoneNumber?: string;
  caste?: string;
  boothId: string;
  voterId: string;
}

export interface VoterFilter {
  ageRange?: [number, number];
  caste?: string;
  address?: string;
  boothId?: string;
}