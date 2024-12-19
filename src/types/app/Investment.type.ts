export interface Investment {
  id: string;                      // Unique ID for each investment
  userID: string;                  // ID of the user who owns the investment
  leadID: string;                  // ID of the prospect to whom the investment belongs
  investmentType: string;  // Type of the investment (Stocks, Bonds, etc.)
  investedAmount: number;          // Amount of money invested
  investmentDate: string;          // Date of the investment
  maturityDate?: string;           // Maturity date of the investment
  expectedReturn?: number;         // Expected return on investment
  comments?: string;               // Comments about the investment
  status: string //'Active' | 'Closed' | 'In Progress'; // Investment status
  contract?: string;               // Link or ID of the contract related to the investment
  strategyID: string;              // ID of the strategy associated with the investment
  notes?: string;                  // Additional comments about the investment
  documents?: Array<{              // Files related to the investment
    id: string;                    // Unique ID for the file
    url: string;                   // URL of the file in Firebase Storage
    description?: string;          // Description of the file
    type: string // 'Performance' | 'Contract' | 'Other'; // Type of the file
    uploadDate: string;            // Date the file was uploaded
  }>;
  timeline?: Array<{               // Timeline of the investment
    id: string;                    // Unique ID for the timeline item
    date: string;                  // Date of the timeline item
    description: string;           // Description of the timeline item
    type: string // 'Event' | 'Document';    // Type of the timeline item
    documentID?: string;           // ID of the document related to the timeline item
  }>;
  createdAt: string;               // Date of creation
  updatedAt: string;               // Date of last update
}

// export type InvestmentType = 'Stocks' | 'Bonds' | 'Real Estate' | 'Mutual Funds' | 'Cryptocurrencies' | 'Startups' | 'Commodities';
