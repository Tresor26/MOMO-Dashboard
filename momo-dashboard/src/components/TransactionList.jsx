import { useState } from 'react';

export default function TransactionList({ transactions }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount).replace('RWF', 'RWF');
  };

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTransactions.map((txn) => (
              <tr 
                key={txn.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedTransaction(txn)}
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(txn.date)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCategory(txn.category)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {formatAmount(txn.amount)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-green-400 hover:text-yellow-400">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {transactions.length > transactionsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white'}`}
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-green-600 text-white'}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">Transaction Details</h3>
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction Type</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatCategory(selectedTransaction.category)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedTransaction.date)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatAmount(selectedTransaction.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reference</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTransaction.reference || 'N/A'}
                    </p>
                  </div>
                </div>
                
                {selectedTransaction.sender && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sender</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTransaction.sender}
                    </p>
                  </div>
                )}
                
                {selectedTransaction.receiver && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Receiver</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedTransaction.receiver}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Message</p>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {selectedTransaction.raw_body}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 bg-momo-blue text-white rounded-md hover:bg-momo-orange"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}