import { MapPin, ArrowLeft, Building2, Clock } from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import { useAuth } from "../../context/AuthContext";

const JobPostingPreview = ({ formData, setIsPreview }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/*Job Info */}
          <div className="p-6 sm:p-8 bg-linear-to-br from-blue-50/70 via-white to-purple-50/50">
            {/* Job Title + Logo */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="mb-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 wrap-break-word">
                    {formData.jobTitle}
                  </h1>
                </div>

                {/* Location */}
                <div className="flex items-center min-w-0">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 shrink-0" />

                  <span className="text-gray-600 font-medium wrap-break-word">
                    {formData.isRemote ? "Remote" : formData.location}
                  </span>

                  {formData.isRemote && formData.location && (
                    <span className="text-gray-400 ml-1 wrap-break-word">
                      {" "}
                      • {formData.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Company Logo */}
              {user?.companyLogo ? (
                <img
                  src={user.companyLogo}
                  alt="Company Logo"
                  className="h-20 w-20 shrink-0 rounded-xl object-cover border border-gray-200 shadow-sm"
                />
              ) : (
                <div className="h-20 w-20 shrink-0 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
                  <Building2 className="h-9 w-9 text-blue-600" />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {/* Category */}
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {CATEGORIES.find((c) => c.value === formData.category)?.label}
              </span>

              {/* Job Type */}
              <span className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                {JOB_TYPES.find((j) => j.value === formData.jobType)?.label}
              </span>

              {/* Posted */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Posted today</span>
              </div>
            </div>

            {/* Salary Desc Require */}
            <div className="pt-8 space-y-7">
              <div className="relative overflow-hidden bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-4">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100 opacity-70" />

                <div className="relative flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-emerald-400 flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">₹</span>
                  </div>

                  {/* Salary Information */}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800">
                      Compensation
                    </p>

                    <div className="flex flex-wrap items-baseline gap-1">
                      <span className="text-sm font-bold text-gray-900">
                        ₹
                        {Number(formData.salaryMin || 0).toLocaleString(
                          "en-IN",
                        )}
                      </span>

                      <span className="text-gray-500 text-xs">-</span>

                      <span className="text-sm font-bold text-gray-900">
                        ₹
                        {Number(formData.salaryMax || 0).toLocaleString(
                          "en-IN",
                        )}
                      </span>

                      <span className="text-xs text-gray-600 ml-1">
                        per year
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {/* Heading */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 rounded-full bg-linear-to-b from-blue-500 to-violet-500 shrink-0" />

                  <h3 className="text-sm font-semibold text-gray-900">
                    About This Role
                  </h3>
                </div>

                {/* Desc Box */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 overflow-hidden">
                  <p className="text-xs leading-5 text-gray-600 wrap-break-word whitespace-pre-line">
                    {formData.description}
                  </p>
                </div>
              </div>

              <div>
                {/* Heading */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 rounded-full bg-linear-to-b from-purple-500 to-pink-500 shrink-0" />

                  <h3 className="text-sm font-semibold text-gray-900">
                    What We're Looking For
                  </h3>
                </div>

                <div className="bg-linear-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl px-4 py-4 overflow-hidden">
                  <p className="text-xs leading-5 text-gray-700 wrap-break-word whitespace-pre-line">
                    {formData.requirements}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/*EDIT */}
          <div className="border-t border-gray-200 bg-white px-6 py-5 sm:px-8">
            <div className="flex justify-end">
              <button
                onClick={() => setIsPreview(false)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;
