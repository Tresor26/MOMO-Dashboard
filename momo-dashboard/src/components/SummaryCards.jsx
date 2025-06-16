export default function SummaryCards({ summary }) {
  const totalTransactions = summary.reduce((acc, item) => acc + item.count, 0);
  const totalAmount = summary.reduce((acc, item) => acc + item.total, 0);
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount).replace('RWF', 'RWF');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
        <p className="text-2xl font-bold">{totalTransactions}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
        <p className="text-2xl font-bold">{formatAmount(totalAmount)}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Transaction Types</h3>
        <p className="text-2xl font-bold">{summary.length}</p>
      </div>
    </div>
  );
}