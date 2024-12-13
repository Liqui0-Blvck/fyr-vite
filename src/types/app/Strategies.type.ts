import { Investment, InvestmentType } from "./Inversion.type";

  export interface Strategy {
    id: string;
    userID: string;
    name: string;
    description: string;
    type: InvestmentType;
    expectedReturn: number;
    risk: 'Low' | 'Medium' | 'High';
    creationDate: string;
    status: 'Active' | 'Paused' | 'Inactive';
    investments: Investment[]; // Investments associated with this strategy
  }
