import { useState, useEffect } from 'react';
import TransactionList from './components/TransactionList';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import Filters from './components/Filters';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    minAmount: '',
    maxAmount: ''
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Build query params from filters
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.date) params.append('date', filters.date);
      
      // Fetch transactions
      const txnResponse = await fetch(`http://localhost:5000/api/transactions?${params}`);
      const txnData = await txnResponse.json();
      setTransactions(txnData);
      
      // Fetch categories if not already loaded
      if (categories.length === 0) {
        const catResponse = await fetch('http://localhost:5000/api/categories');
        const catData = await catResponse.json();
        setCategories(catData);
      }
      
      // Fetch summary
      const summaryResponse = await fetch('http://localhost:5000/api/summary');
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);
      
      // Fetch monthly data 
      const monthlyResponse = await fetch('http://localhost:5000/api/monthly-transactions');
      const monthlyData = await monthlyResponse.json();
      setMonthlyData(monthlyData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      date: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-momo-blue text-yellow-300 p-4 shadow-md">
        <h1 className="text-2xl font-bold">MoMo Transaction Dashboard</h1>
      </header>
      
      <main className="container mx-auto p-4">
        <Filters 
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />
        
        <SummaryCards summary={summary} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <Charts 
              summary={summary} 
              transactions={transactions}
              monthlyData={monthlyData}
            />
          </div>
          <div>
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;