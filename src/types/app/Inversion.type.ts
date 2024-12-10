export interface Investment {
  id: string;                      // Unique ID for each investment
  userID: string;                  // ID of the user who owns the investment
  leadID: string;                  // ID of the prospect to whom the investment belongs
  investmentType: InvestmentType;  // Type of the investment (Stocks, Bonds, etc.)
  investedAmount: number;          // Amount of money invested
  investmentDate: string;          // Date of the investment
  maturityDate?: string;           // Maturity date of the investment
  expectedReturn?: number;         // Expected return on investment
  comments?: string;               // Comments about the investment
  status: 'Active' | 'Closed' | 'In Progress'; // Investment status
  contract?: string;               // Link or ID of the contract related to the investment
  notes?: string;                  // Additional comments about the investment
  documents?: Array<{              // Files related to the investment
    id: string;                    // Unique ID for the file
    url: string;                   // URL of the file in Firebase Storage
    description?: string;          // Description of the file
    type: 'Performance' | 'Contract' | 'Other'; // Type of the file
    uploadDate: string;            // Date the file was uploaded
  }>;
  createdAt: string;               // Date of creation
  updatedAt: string;               // Date of last update
}

export type InvestmentType = 'Stocks' | 'Bonds' | 'Real Estate' | 'Mutual Funds' | 'Cryptocurrencies' | 'Startups' | 'Commodities';
