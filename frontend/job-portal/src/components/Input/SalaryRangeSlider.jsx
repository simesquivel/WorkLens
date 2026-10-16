import { useState } from "react";

const SalaryRangeSlider = ({ filters, handleFilterChange }) => {
  const [minSalary, setMinSalary] = useState(filters?.minSalary || 0);
  const [maxSalary, setMaxSalary] = useState(filters?.maxSalary || 0);

return (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <div className="min-w-0">
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Min Salary
        </label>
        <input
          type="number"
          placeholder="0"
          min="0"
          step="1000"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={minSalary || ""}
          onChange={({ target }) => setMinSalary(target.value)}
          onBlur={() =>
            handleFilterChange(
              "minSalary",
              minSalary ? parseInt(minSalary) : "",
            )
          }
        />
      </div>

      <div className="min-w-0">
        <label className="mb-1.5 block text-xs font-medium text-gray-600">
          Max Salary
        </label>
        <input
          type="number"
          placeholder="No Limit"
          min="0"
          step="1000"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={maxSalary || ""}
          onChange={({ target }) => setMaxSalary(target.value)}
          onBlur={() =>
            handleFilterChange(
              "maxSalary",
              maxSalary ? parseInt(maxSalary) : "",
            )
          }
        />
      </div>
    </div>

    {/* Display current range */}
    {(minSalary || maxSalary) ? (
      <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
        <span className="text-gray-500">Range: </span>
        {minSalary ? `₹${minSalary.toLocaleString()}` : "$0"} -{" "}
        {maxSalary ? `₹${maxSalary.toLocaleString()}` : "No Limit"}
      </div>
    ) : null}
  </div>
);

};

export default SalaryRangeSlider;
