import { ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../../utils/data";
import SalaryRangeSlider from "../../../components/Input/SalaryRangeSlider";

const FilterSection = ({ title, children, isExpanded, onToggle }) => (
  <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors"
    >
      {title}
      {isExpanded ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>
    {isExpanded && children}
  </div>
);

const FilterContent = ({
  toggleSection,
  clearAllFilters,
  expandedSections,
  filters,
  handleFilterChange,
}) => {
  return (
    <div className="divide-y divide-gray-100">
      {/* Job Type */}
      <div className="px-4 py-3">
        <FilterSection
          title="Job Type"
          isExpanded={expandedSections?.jobType}
          onToggle={() => toggleSection("jobType")}
        >
          <div className="mt-3 space-y-2">
            {JOB_TYPES.map((type) => (
              <label
                key={type.value}
                className="flex cursor-pointer items-center gap-2.5 rounded-md py-0.5 text-sm text-gray-600 hover:text-blue-700"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600 focus:ring-blue-500"
                  checked={filters?.type === type.value}
                  onChange={(e) =>
                    handleFilterChange(
                      "type",
                      e.target.checked ? type.value : ""
                    )
                  }
                />
                <span>{type.value}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Salary Range */}
      <div className="px-4 py-3">
        <FilterSection
          title="Salary Range"
          isExpanded={expandedSections?.salary}
          onToggle={() => toggleSection("salary")}
        >
          <div className="mt-3">
            <SalaryRangeSlider
              filters={filters}
              handleFilterChange={handleFilterChange}
            />
          </div>
        </FilterSection>
      </div>

      {/* Category */}
      <div className="px-4 py-3">
        <FilterSection
          title="Category"
          isExpanded={expandedSections?.categories}
          onToggle={() => toggleSection("categories")}
        >
          <div className="mt-3 space-y-2">
            {CATEGORIES.map((type) => (
              <label
                key={type.value}
                className="flex cursor-pointer items-center gap-2.5 rounded-md py-0.5 text-sm text-gray-600 hover:text-blue-700"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600 focus:ring-blue-500"
                  checked={filters?.category === type.value}
                  onChange={(e) =>
                    handleFilterChange(
                      "category",
                      e.target.checked ? type.value : ""
                    )
                  }
                />
                <span>{type.value}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
export default FilterContent;
