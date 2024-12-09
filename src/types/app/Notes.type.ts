export interface Notes {
  id?: string;
  updatedAt?: string;
  createdAt?: string;
  content: string;
  date?: string | Date | undefined
  leadID: string | string[];
  userID: string;
}