export default function Filters({ categories, filters, onFilterChange, onReset }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Transactions</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount (RWF)</label>
          <input
            type="number"
            value={filters.minAmount}
            onChange={(e) => onFilterChange('minAmount', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>
        
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full bg-momo-yellow hover:bg-momo-green text-gray-800 py-2 px-4 rounded-md transition duration-200"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}