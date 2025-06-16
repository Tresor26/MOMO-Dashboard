import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement
);

export default function Charts({ summary, transactions, monthlyData }) {
  // Define consistent colors for transaction types
  const colorMap = {
    'incoming_money': '#10B981',        // Green
    'payments_to_code_holders': '#3B82F6', // Blue
    'transfers_to_mobile': '#8B5CF6',   // Purple
    'bank_deposits': '#FF8C00',         // orange dark
    'bank_transfers': '#F59E0B',        // Amber
    'airtime_purchases': '#EF4444',     // Red
    'cash_power_bills': '#F97316',      // Orange
    'third_party_transactions': '#EC4899', // Pink
    'agent_withdrawals': '#64748B',     // Slate
    'internet_voice_bundles': '#84CC16', // Lime
    'other_transfers': '#6B7280'        // Gray
  };

  const getColorsForCategories = (categories) => {
    return categories.map(category => 
      colorMap[category] || '#9CA3AF'
    );
  };

  const pieData = {
    labels: summary.map(item => item.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
    datasets: [{
      data: summary.map(item => item.count),
      backgroundColor: getColorsForCategories(summary.map(item => item.category)),
      borderWidth: 2,
      borderColor: '#ffffff',
    }]
  };

  // Format month labels for better readability
  const formatMonthLabel = (monthString) => {
    const [year, month] = monthString.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // Monthly transactions chart data
  const monthlyChartData = {
    labels: monthlyData?.map(item => formatMonthLabel(item.month)) || [],
    datasets: [
      {
        label: 'Transaction Count',
        data: monthlyData?.map(item => item.transaction_count) || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      }
    ]
  };

  // Monthly amount chart data
  const monthlyAmountData = {
    labels: monthlyData?.map(item => formatMonthLabel(item.month)) || [],
    datasets: [
      {
        label: 'Incoming Amount',
        data: monthlyData?.map(item => item.incoming_amount || 0) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10B981',
        borderWidth: 1,
      },
      {
        label: 'Outgoing Amount',
        data: monthlyData?.map(item => item.outgoing_amount || 0) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: '#EF4444',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Transaction Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-md font-medium mb-2">Transactions by Type</h3>
          <div className="h-64">
            <Pie 
              data={pieData} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      padding: 10,
                      usePointStyle: true,
                      font: {
                        size: 11
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.raw / total) * 100).toFixed(1);
                        return `${context.label}: ${context.raw} (${percentage}%)`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Top Transaction Categories by Amount</h3>
          <div className="h-64">
            <Bar 
              data={{
                labels: summary.slice(0, 5).map(item => item.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
                datasets: [{
                  label: 'Total Amount (RWF)',
                  data: summary.slice(0, 5).map(item => item.total),
                  backgroundColor: getColorsForCategories(summary.slice(0, 5).map(item => item.category)),
                  borderWidth: 1,
                  borderColor: getColorsForCategories(summary.slice(0, 5).map(item => item.category)).map(color => 
                    color.replace('rgb', 'rgba').replace(')', ', 0.8)')
                  ),
                }]
              }} 
              options={{ 
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Top 5 Categories by Total Amount'
                  },
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Total: ${new Intl.NumberFormat('en-RW', {
                          style: 'currency',
                          currency: 'RWF',
                          maximumFractionDigits: 0
                        }).format(context.raw).replace('RWF', 'RWF')}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Total Amount (RWF)'
                    },
                    ticks: {
                      callback: function(value) {
                        return new Intl.NumberFormat('en-RW', {
                          notation: 'compact',
                          maximumFractionDigits: 1
                        }).format(value) + ' RWF';
                      }
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Transaction Categories'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Monthly Transaction Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-md font-medium mb-2">Monthly Transaction Count</h3>
          <div className="h-64">
            <Line 
              data={monthlyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Transactions: ${context.raw}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Month'
                    }
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Transactions'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium mb-2">Monthly Transaction Amounts (Income vs Expenses)</h3>
          <div className="h-64">
            <Bar 
              data={monthlyAmountData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${new Intl.NumberFormat('en-RW', {
                          style: 'currency',
                          currency: 'RWF',
                          maximumFractionDigits: 0
                        }).format(context.raw).replace('RWF', 'RWF')}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Month'
                    }
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount (RWF)'
                    },
                    ticks: {
                      callback: function(value) {
                        return new Intl.NumberFormat('en-RW', {
                          notation: 'compact',
                          maximumFractionDigits: 1
                        }).format(value) + ' RWF';
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}