export interface Person {
  id: string;
  name: string;
  emoji: string;
  notes?: string;
  createdAt: string;
  birthdays: Birthday[];
}

export interface Birthday {
  id: string;
  date: string;
  personId: string;
}

export interface CreatePersonDto {
  name: string;
  emoji?: string;
  date: string;
}

export interface UpdatePersonDto {
  name?: string;
  emoji?: string;
  date?: string;
}
