import { ArrowLeft, Bookmark, Grid, List } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import JobCard from "../../components/Cards/JobCard";
import toast from "react-hot-toast";

const SavedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedJobList, setSavedJobList] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  const getSavedJobs = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
      setSavedJobList(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      toast.success("Job removed successfully!");

      getSavedJobs();
    } catch (err) {
      toast.error("Something went wrong! Try again later");
    }
  };

  useEffect(() => {
    if (user) {
      getSavedJobs();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/70 via-white to-purple-50/50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {savedJobList && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-blue-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Saved Jobs
                </h1>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500">
                  {savedJobList.length} saved{" "}
                  {savedJobList.length === 1 ? "job" : "jobs"}
                </span>

                <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-4 shadow-sm sm:p-6">
              {/* Job Grid */}
              {savedJobList.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl px-5 py-16 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <Bookmark className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    You haven't saved any jobs yet
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Start saving jobs that interest you to view them later.
                  </p>
                  <button
                    onClick={() => navigate("/find-jobs")}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6"
                        : "space-y-4 lg:space-y-6"
                    }
                  >
                    {savedJobList.map((savedJob) => (
                      <JobCard
                        key={savedJob._id}
                        job={savedJob.job}
                        onClick={() => navigate(`/job/${savedJob?.job?._id}`)}
                        onToggleSave={() => handleUnsaveJob(savedJob?.job?._id)}
                        saved
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
