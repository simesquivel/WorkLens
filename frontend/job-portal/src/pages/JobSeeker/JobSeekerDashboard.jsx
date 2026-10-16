import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, X, NavigationOff } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import FilterContent from "./components/FilterContent";
import axios from "axios";
import SearchHeader from "./components/SearchHeader";
import Navbar from "../../components/layout/Navbar";
import JobCard from "../../components/Cards/JobCard";

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  });

  // Sidebar collapse states
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    salary: true,
    categories: true,
  });

  // Function to fetch jobs from API
  const fetchJobs = async (filterParams = {}) => {
    try {
      setLoading(false);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();

      if (filterParams.keyword) params.append("keyword", filterParams.keyword);
      if (filterParams.location)
        params.append("location", filterParams.location);
      if (filterParams.minSalary)
        params.append("minSalary", filterParams.minSalary);
      if (filterParams.maxSalary)
        params.append("maxSalary", filterParams.maxSalary);
      if (filterParams.type) params.append("type", filterParams.type);
      if (filterParams.category)
        params.append("category", filterParams.category);
      if (user) params.append("userId", user?._id);

      const response = await axiosInstance.get(
        `${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`,
      );



      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];


      
      if (user) {
  const applicationsResponse = await axiosInstance.get(
    "/api/applications/my"
  );

  const applications =
    applicationsResponse.data.applications ||
    applicationsResponse.data;



  const updatedJobs = jobsData.map((job) => {
    const application = applications.find(
      (app) =>
        String(app.job?._id || app.job) === String(job._id)
    );

    return {
      ...job,
      applicationStatus: application?.status || null,
    };
  });

  console.log("Updated jobs:", updatedJobs);
  setJobs(updatedJobs);
} else {
  setJobs(jobsData);
}
      
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs. Please try again later.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const apiFilters = {
        keyword: filters.keyword,
        location: filters.location,
        minSalary: filters.minSalary,
        maxSalary: filters.maxSalary,
        category: filters.category,
        type: filters.type,
        experience: filters.experience,
        remoteOnly: filters.remoteOnly,
      };

      // Only call API if there are meaningful filters
      const hasFilters = Object.values(apiFilters).some(
        (value) =>
          value !== "" &&
          value !== false &&
          value !== null &&
          value !== undefined,
      );

      if (hasFilters) {
        fetchJobs(apiFilters);
      } else {
        fetchJobs(); // Fetch all jobs if no filters
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, user]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      category: "",
      type: "",
      minSalary: "",
      maxSalary: "",
    });
  };

  const MobileFilterOverlay = () => (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${
        showMobileFilters ? "" : "hidden"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowMobileFilters(false)}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

          <button
            onClick={() => setShowMobileFilters(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100%-73px)] overflow-y-auto px-5 py-5">
          <FilterContent
            toggleSection={toggleSection}
            clearAllFilters={clearAllFilters}
            expandedSections={expandedSections}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );

  const toggleSaveJob = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed successfully!");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully!");
      }

      fetchJobs();
    } catch (err) {
      console.log("Error:", err);
      toast.error("Something went wrong! Try again later");
    }
  };

  const applyToJob = async (jobId) => {
    
    try {
      const response = await axiosInstance.post(
        API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId),
      );

      toast.success(
        response.data.message || "Application submitted successfully!",
      );
      await fetchJobs();
    } catch (error) {
      console.error(
        "Error applying to job:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to apply for this job.",
      );
    }
  };

  if (jobs.length == 0 && loading) {
    return <LoadingSpinner />;
  }

return (
  <div className="min-h-screen bg-linear-to-br from-blue-50/70 via-white to-purple-50/60">
    <Navbar />

    <div className="pt-5 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <SearchHeader
          filters={filters}
          handleFilterChange={handleFilterChange}
        />

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-5 mt-5">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-60 xl:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
              <h3 className="px-4 py-3.5 text-sm font-semibold text-gray-900 border-b border-gray-100">
                Filter Jobs
              </h3>

              <FilterContent
                toggleSection={toggleSection}
                clearAllFilters={clearAllFilters}
                expandedSections={expandedSections}
                filters={filters}
                handleFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {jobs.length}
                </span>{" "}
                jobs
              </p>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>

                {/* View Mode */}
                <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Results */}
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                  <Search className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="text-base font-semibold text-gray-900">
                  No jobs found
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Try adjusting your search criteria or filters.
                </p>

                <button
                  onClick={clearAllFilters}
                  className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
                      : "space-y-3"
                  }
                >
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onClick={() => navigate(`/job/${job._id}`)}
                      onToggleSave={() => toggleSaveJob(job._id, job.isSaved)}
                      onApply={() => applyToJob(job._id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      <MobileFilterOverlay />
    </div>
  </div>
);

};

export default JobSeekerDashboard;
