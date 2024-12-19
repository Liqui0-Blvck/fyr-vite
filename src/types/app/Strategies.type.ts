import { Investment } from "./Investment.type";

export interface Strategy {
  id: string; // ID único de la estrategia
  name: string; // Nombre de la estrategia
  userID: string,
  description: string; // Descripción completa
  type: string //'Conservative' | 'Moderate' | 'Aggressive'; // Tipo de estrategia
  expectedReturn: number; // Rentabilidad esperada en porcentaje
  risk: string // 'Low' | 'Medium' | 'High';
  timeHorizon?: string; // Horizonte temporal recomendado
  recommendedAssets?: string[]; // Activos recomendados para la estrategia
  diversification?: string[]; // Recomendaciones de diversificación
  status: string // 'Active' | 'Paused' | 'Inactive';
  investmentAmountRange?: string; // Monto recomendado para invertir
  investments?: Investment[]; // Investments associated with this strategy
  targetAudience?: string; // Audiencia objetivo (ej. "Inversores conservadores")
  costAndFees?: number; // Costos asociados con la estrategia
  performanceHistory?: string; // Datos históricos de rendimiento (si es aplicable)
  strategyNotes?: string; // Notas adicionales de la estrategia
  createdAt: string;
  updatedAt: string;
}

