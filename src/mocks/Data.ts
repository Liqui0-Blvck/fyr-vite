import { Strategy } from "src/types/app/Strategies.type";
import { Investment } from "../types/app/Inversion.type";

export const investmentRecords: Investment[] = [
  {
    id: 'INV001',
    userID: 'user01',
    leadID: 'lead01',
    investmentType: 'Stocks',
    investedAmount: 10000,
    investmentDate: '2024-01-15',
    maturityDate: '2025-01-15',
    expectedReturn: 8,
    status: 'Active',
    strategyID: 'STR001',
    contract: 'https://link-to-contract.com/INV001',
    comments: 'Investment in tech stocks.',
    documents: [
      {
        id: 'DOC001',
        url: 'https://storage-link-to-file.com/file1',
        description: 'Performance report MetaTrader 5',
        type: 'Performance',
        uploadDate: '2024-02-01',
      }
    ],
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-02-01T14:00:00Z',
  },
  {
    id: 'INV002',
    userID: 'user02',
    leadID: 'lead02',
    strategyID: 'STR001',
    investmentType: 'Bonds',
    investedAmount: 5000,
    investmentDate: '2024-02-10',
    maturityDate: '2025-02-10',
    expectedReturn: 6,
    status: 'In Progress',
    contract: 'https://link-to-contract.com/INV002',
    comments: 'Investment in corporate bonds.',
    documents: [
      {
        id: 'DOC002',
        url: 'https://storage-link-to-file.com/file2',
        description: 'Performance report MetaTrader 5',
        type: 'Performance',
        uploadDate: '2024-03-01',
      }
    ],
    createdAt: '2024-02-10T12:00:00Z',
    updatedAt: '2024-03-01T14:00:00Z',
  },
  {
    id: 'INV003',
    userID: 'user03',
    leadID: 'lead03',
    strategyID: 'STR001',
    investmentType: 'Cryptocurrencies',
    investedAmount: 3000,
    investmentDate: '2024-03-05',
    maturityDate: '2025-03-05',
    expectedReturn: 15,
    status: 'Active',
    contract: 'https://link-to-contract.com/INV003',
    comments: 'Investment in diversified cryptocurrencies.',
    documents: [
      {
        id: 'DOC003',
        url: 'https://storage-link-to-file.com/file3',
        description: 'Performance report MetaTrader 5',
        type: 'Performance',
        uploadDate: '2024-03-10',
      }
    ],
    createdAt: '2024-03-05T12:00:00Z',
    updatedAt: '2024-03-10T14:00:00Z',
  },
  {
    id: 'INV004',
    userID: 'user04',
    leadID: 'lead04',
    strategyID: 'STR002',
    investmentType: 'Real Estate',
    investedAmount: 20000,
    investmentDate: '2024-04-01',
    maturityDate: '2026-04-01',
    expectedReturn: 5,
    status: 'Active',
    contract: 'https://link-to-contract.com/INV004',
    comments: 'Investment in commercial real estate.',
    documents: [
      {
        id: 'DOC004',
        url: 'https://storage-link-to-file.com/file4',
        description: 'Performance report MetaTrader 5',
        type: 'Performance',
        uploadDate: '2024-04-10',
      }
    ],
    createdAt: '2024-04-01T12:00:00Z',
    updatedAt: '2024-04-10T14:00:00Z',
  },
  {
    id: 'INV005',
    userID: 'user05',
    leadID: 'lead05',
    investmentType: 'Commodities',
    investedAmount: 8000,
    investmentDate: '2024-05-20',
    maturityDate: '2025-05-20',
    expectedReturn: 7,
    strategyID: 'STR003',
    status: 'Closed',
    contract: 'https://link-to-contract.com/INV005',
    comments: 'Investment in precious metals.',
    documents: [
      {
        id: 'DOC005',
        url: 'https://storage-link-to-file.com/file5',
        description: 'Performance report MetaTrader 5',
        type: 'Performance',
        uploadDate: '2024-06-01',
      }
    ],
    createdAt: '2024-05-20T12:00:00Z',
    updatedAt: '2024-06-01T14:00:00Z',
  },
  {
    id: 'INV006',
    userID: 'user06',
    leadID: 'lead06',
    strategyID: 'STR002',
    investmentType: 'Stocks',
    investedAmount: 12000,
    investmentDate: '2024-06-15',
    maturityDate: '2025-06-15',
    expectedReturn: 10,
    status: 'Active',
    contract: 'https://link-to-contract.com/INV006',
    comments: 'Investment in tech stocks.',
    documents: [
      {
        id: 'DOC006',
        url: 'https://storage-link-to-file.com/file6',
        description: 'Performance report MetaTrader 5',
        type: 'Performance',
        uploadDate: '2024-07-01',
      }
    ],
    createdAt: '2024-06-15T12:00:00Z',
    updatedAt: '2024-07-01T14:00:00Z',
  },
  {
    id: 'INV007',
    userID: 'user07',
    leadID: 'lead07',
    strategyID: 'STR001',
    investmentType: 'Bonds',
    investedAmount: 15000,
    investmentDate: '2024-07-10',
    maturityDate: '2026-07-10',
    expectedReturn: 4,
    status: 'In Progress',
    contract: 'https://link-to-contract.com/INV007',
    comments: 'Investment in government bonds.',
    documents: [
      {
        id: 'DOC007',
        url: 'https://storage-link-to-file.com/file7',
        description: 'Performance report MetaTrader 5',
        type: 'Performance',
        uploadDate: '2024-08-01',
      }
    ],
    createdAt: '2024-07-10T12:00:00Z',
    updatedAt: '2024-08-01T14:00:00Z',
  },
  {
    id: 'INV008',
    userID: 'user08',
    leadID: 'lead08',
    strategyID: 'STR002',
    investmentType: 'Cryptocurrencies',
    investedAmount: 9000,
    investmentDate: '2024-08-05',
    maturityDate: '2025-08-05',
    expectedReturn: 13,
    status: 'Active',
    contract: 'https://link-to-contract.com/INV008',
    comments: 'Investment in high-performing cryptocurrencies.',
    documents: [
      {
        id: 'DOC008',
        url: 'https://storage-link-to-file.com/file8',
        description: 'Performance report MetaTrader 5',
        type: 'Performance',
        uploadDate: '2024-09-01',
      }
    ],
    createdAt: '2024-08-05T12:00:00Z',
    updatedAt: '2024-09-01T14:00:00Z',
  },
  {
    id: 'INV009',
    userID: 'user09',
    leadID: 'lead09',
    strategyID: 'STR003',
    investmentType: 'Real Estate',
    investedAmount: 25000,
    investmentDate: '2024-09-01',
    maturityDate: '2027-09-01',
    expectedReturn: 5,
    status: 'Closed',
    contract: 'https://link-to-contract.com/INV009',
    comments: 'Investment in commercial properties.',
    documents: [
      {
        id: 'DOC009',
        url: 'https://storage-link-to-file.com/file9',
        description: 'Performance report MetaTrader 5',
        type: 'Performance',
        uploadDate: '2024-09-10',
      }
    ],
    createdAt: '2024-09-01T12:00:00Z',
    updatedAt: '2024-09-10T14:00:00Z',
  }
];

export const investmentStrategies: Strategy[] = [
  {
    id: 'STR001',
    userID: 'user01',
    name: 'Conservative Strategy',
    description: 'Low-risk strategy focused on bonds and real estate.',
    type: 'Bonds',
    expectedReturn: 5,
    risk: 'Low',
    creationDate: '2024-01-01',
    status: 'Active',
    investments: [
      {
        id: 'INV001',
        userID: 'user01',
        leadID: 'lead01',
        investmentType: 'Bonds',
        investedAmount: 5000,
        investmentDate: '2024-01-15',
        status: 'Active',
        strategyID: 'STR001',
        expectedReturn: 4.5,
        comments: 'Investing in 10-year government bonds.',
        documents: [
          {
            id: 'DOC001',
            url: 'https://link-to-doc1.com',
            description: 'Bond purchase contract',
            type: 'Contract',
            uploadDate: '2024-01-16'
          }
        ],
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-16T12:00:00Z',
      }
    ]
  },
  {
    id: 'STR002',
    userID: 'user02',
    name: 'Aggressive Strategy',
    description: 'High-risk strategy investing in stocks and cryptocurrencies.',
    type: 'Stocks',
    expectedReturn: 15,
    risk: 'High',
    creationDate: '2024-03-01',
    status: 'Active',
    investments: [
      {
        id: 'INV002',
        userID: 'user02',
        leadID: 'lead02',
        investmentType: 'Stocks',
        investedAmount: 10000,
        investmentDate: '2024-03-10',
        status: 'Active',
        strategyID: 'STR002',
        expectedReturn: 12,
        comments: 'Investing in tech stocks with high volatility.',
        documents: [
          {
            id: 'DOC002',
            url: 'https://link-to-doc2.com',
            description: 'Stock investment performance',
            type: 'Performance',
            uploadDate: '2024-03-15'
          }
        ],
        createdAt: '2024-03-10T12:00:00Z',
        updatedAt: '2024-03-15T12:00:00Z',
      },
      {
        id: 'INV003',
        userID: 'user02',
        leadID: 'lead03',
        investmentType: 'Cryptocurrencies',
        investedAmount: 3000,
        investmentDate: '2024-03-20',
        status: 'Active',
        strategyID: 'STR002',
        expectedReturn: 20,
        comments: 'Investment in Bitcoin and Ethereum.',
        documents: [
          {
            id: 'DOC003',
            url: 'https://link-to-doc3.com',
            description: 'Cryptocurrency performance report',
            type: 'Performance',
            uploadDate: '2024-03-25'
          }
        ],
        createdAt: '2024-03-20T12:00:00Z',
        updatedAt: '2024-03-25T12:00:00Z',
      }
    ]
  },
  {
    id: 'STR003',
    userID: 'user03',
    name: 'Real Estate Strategy',
    description: 'Strategy focused on residential and commercial real estate investments.',
    type: 'Real Estate',
    expectedReturn: 8,
    risk: 'Medium',
    creationDate: '2024-06-01',
    status: 'Active',
    investments: [
      {
        id: 'INV004',
        userID: 'user03',
        leadID: 'lead04',
        investmentType: 'Real Estate',
        investedAmount: 25000,
        investmentDate: '2024-06-10',
        status: 'Active',
        strategyID: 'STR003',
        expectedReturn: 7,
        comments: 'Investing in residential real estate in growing neighborhoods.',
        documents: [
          {
            id: 'DOC004',
            url: 'https://link-to-doc4.com',
            description: 'Property purchase agreement',
            type: 'Contract',
            uploadDate: '2024-06-15'
          }
        ],
        createdAt: '2024-06-10T12:00:00Z',
        updatedAt: '2024-06-15T12:00:00Z',
      }
    ]
  }
];
