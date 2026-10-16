import { MapPin, DollarSign, Building2, Clock, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import moment from "moment";
import StatusBadge from "../../components/StatusBadge";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { user } = useAuth();
  const { jobId } = useParams();

  const [jobDetails, setJobDetails] = useState(null);

  const getJobDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOB_BY_ID(jobId),
        {
          params: { userId: user?._id || null },
        },
      );
      setJobDetails(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const applyToJob = async () => {
    try {
      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Applied to job successfully!");
      }

      getJobDetailsById();
    } catch (err) {
      console.log("Error:", err);
      const errorMsg = err?.response?.data?.message;
      toast.error(errorMsg || "Something went wrong! Try again later");
    }
  };

  useEffect(() => {
    if (jobId && user) {
      getJobDetailsById();
    }
  }, [jobId, user]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/70 via-white to-purple-50/50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Content card */}
        {jobDetails && (
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-linear-to-r from-blue-50/80 via-white to-purple-50/60 px-5 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  {jobDetails?.company?.companyLogo ? (
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white shadow-[0_8px_8px_rgba(0,0,0,0.16)]">
                      <img
                        src={jobDetails.company.companyLogo}
                        alt="Company Logo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-blue-600 shadow-[0_4px_8px_rgba(0,0,0,0.16)]">
                      <Building2 className="h-7 w-7" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                      {jobDetails.title}
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="wrap-break-word">
                          {jobDetails.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {jobDetails?.applicationStatus ? (
                    <StatusBadge status={jobDetails.applicationStatus} />
                  ) : (
                    <button
                      onClick={applyToJob}
                      className="inline-flex w-full shrink-0 items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Apply Now
                    </button>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {jobDetails.category}
                  </span>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                    {jobDetails.type}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-gray-500 ring-1 ring-gray-200">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      {jobDetails.createdAt
                        ? moment(jobDetails.createdAt).format("Do MMM YYYY")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-5 py-6 sm:px-8 sm:py-8">
              {/* Salary section */}
              <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50/80 p-5 sm:p-6">
                  <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-100/70" />

                  <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                        <span className="text-2xl font-semibold">₹</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">
                          Compensation
                        </h3>
                        <div className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                          {jobDetails.salaryMin} - {jobDetails.salaryMax}
                          <span className="ml-2 text-sm font-normal text-gray-600">
                            per year
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-fit items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-2 text-sm font-medium text-emerald-800">
                      <Users className="h-4 w-4 text-emerald-700" />
                      <span>Competitive</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-3 text-lg font-bold text-gray-900">
                  <div className="h-9 w-1 rounded-full bg-linear-to-b from-blue-500 to-purple-600"></div>
                  <span>About This Role</span>
                </h3>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
                  <div className="whitespace-pre-line wrap-break-word text-sm leading-7 text-gray-600 sm:text-base">
                    {jobDetails.description}
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-2">
                <h3 className="mb-4 flex items-center gap-3 text-lg font-bold text-gray-900">
                  <div className="h-9 w-1 rounded-full bg-linear-to-b from-purple-500 to-pink-500"></div>
                  <span>What We're Looking For</span>
                </h3>
                <div className="rounded-xl border border-purple-100 bg-linear-to-r from-purple-50/90 to-pink-50/70 p-5 sm:p-6">
                  <div className="whitespace-pre-line wrap-break-word text-sm leading-7 text-gray-600 sm:text-base">
                    {jobDetails.requirements}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
