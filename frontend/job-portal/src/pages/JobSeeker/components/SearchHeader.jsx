import { MapPin, Search } from "lucide-react"

const SearchHeader = ({ filters, handleFilterChange }) => {
  return (
    <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Find Your Dream Job 
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                    Discover opportunities that match your passion
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Job title, company, or keyboards"
                        className="w-full h-12 pl-11 pr-4 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors"
                        value={filters.keyword}
                        onChange={(e) => handleFilterChange("keyword", e.target.value)}
                    />
                </div>

                <div className="relative w-full lg:w-64">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Location"
                        className="w-full h-12 pl-11 pr-4 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors"
                        value={filters.location}
                        onChange={(e) => handleFilterChange("location", e.target.value)}
                    />
                </div>

                <button className="h-12 px-7 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                    Search Jobs
                </button>
            </div>
        </div>
    </div>
  )
}

export default SearchHeader