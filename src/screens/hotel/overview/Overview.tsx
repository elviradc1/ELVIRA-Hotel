export function Overview() {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <svg
          className="w-6 h-6 text-gray-600 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <p className="text-gray-500 text-center">
          Overview dashboard content will go here
        </p>
      </div>
    </div>
  );
}
