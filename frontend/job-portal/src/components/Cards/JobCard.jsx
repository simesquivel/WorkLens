import { Bookmark, Building2, Building, Calendar, MapPin, Book } from "lucide-react";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../StatusBadge";

const JobCard = ({ job, onClick, onToggleSave, onApply, saved, hideApply }) => {
  const { user } = useAuth();

  const formatSalary = (min, max) => {
    const formatNumber = (num) => {
        if (num >= 1000) return `₹${(num / 1000).toFixed(0)}k`;
        return `₹${num}`;
    };
    return `${formatNumber(min)}/m`;
  }

  return (
  <div
    onClick={onClick}
    className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
  >
    {/* Company Details */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {job?.company?.companyLogo ? (
          <img
            src={job?.company?.companyLogo}
            alt="Company Logo"
            className="h-14 w-14 shrink-0 rounded-xl border border-gray-100 object-contain p-1"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <Building2 className="h-7 w-7 text-blue-600" />
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
            {job?.title}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <Building className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {job?.company?.companyName}
            </span>
          </p>
        </div>
      </div>

      {user && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className="shrink-0 rounded-lg p-2 transition-colors hover:bg-blue-50"
          aria-label="Save job"
        >
          <Bookmark
            className={`h-5 w-5 transition-colors ${
              job?.isSaved || saved
                ? "fill-blue-600 text-blue-600"
                : "text-gray-400 hover:text-blue-600"
            }`}
          />
        </button>
      )}
    </div>

    {/* Job Details */}
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-600">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          {job?.location || "Location not specified"}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            job?.type === "Full-Time"
              ? "bg-green-100 text-green-800"
              : job?.type === "Part-Time"
                ? "bg-yellow-100 text-yellow-800"
                : job?.type === "Contract"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
          }`}
        >
          {job?.type || "Not specified"}
        </span>

        {job?.category && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {job.category}
          </span>
        )}
      </div>
    </div>

    {/* Posted Date */}
    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
      <Calendar className="h-4 w-4 text-gray-400" />

      <span className="text-sm text-gray-500">
        Posted{" "}
        {job?.createdAt
          ? moment(job.createdAt).format("Do MMM YYYY")
          : "N/A"}
      </span>
    </div>

    {/* Salary and Actions */}
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <div className="text-base font-bold text-gray-900">
        {formatSalary(job?.salaryMin, job?.salaryMax)}
      </div>

      {!saved && (
        <div className="flex items-center gap-2">
          {job?.applicationStatus ? (
            <StatusBadge status={job.applicationStatus} />
          ) : (
            !hideApply && (
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply();
                }}
              >
                Apply Now
              </button>
            )
          )}
        </div>
      )}
    </div>
  </div>
);
}

export default JobCard