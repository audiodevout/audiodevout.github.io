import { useQuery } from '@tanstack/react-query';

// Import the portfolio data
async function getPortfolioData() {
  const { portfolioData } = await import('@/data/portfolio_data.js');
  return portfolioData;
}

export function usePortfolioData() {
  return useQuery({
    queryKey: ['portfolio-data'],
    queryFn: getPortfolioData,
    staleTime: Infinity, // Data doesn't change often
    gcTime: Infinity,
  });
}
