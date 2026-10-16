import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { getInitials } from "../../utils/helper";
import StatusBadge from "../../components/StatusBadge";
import ApplicantProfilePreview from "../../components/Cards/ApplicantProfilePreview";

const ApplicationViewer = () => {
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId),
      );
      setApplications(response.data);
    } catch (err) {
      console.log("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchApplications();
    else navigate("/manage-jobs");
  }, []);

  //Group applications by job
  const groupedApplications = useMemo(() => {
    const filtered = applications.filter((app) => app.job.title.toLowerCase());

    return filtered.reduce((acc, app) => {
      const jobId = app.job._id;

      if (!acc[jobId]) {
        acc[jobId] = {
          job: app.job,
          applications: [],
        };
      }

      acc[jobId].applications.push(app);

      return acc;
    }, {});
  }, [applications]);

  const handleDownloadResume = (resumeUrl) => {
    window.open(resumeUrl, "_blank");
  };

  return (
    <DashboardLayout activeMenu="manage-jobs">
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center gap-6">
                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:text-white hover:border-blue-600 hover:bg-blue-700 transition-all duration-200"
                  onClick={() => navigate("/manage-jobs")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Applications Overview
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main COntent */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-8">
          {Object.keys(groupedApplications).length === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <Users className="mx-auto h-24 w-24 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No applications available.
              </h3>
              <p className="mt-2 text-gray-500">
                No applications found at the moment.
              </p>
            </div>
          ) : (
            //Applications by Job
            <div className="space-y-8">
              {Object.values(groupedApplications).map(
                ({ job, applications }) => (
                  <div
                    className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl shadow-md overflow-hidden"
                    key={job._id}
                  >
                    {/* Job Header */}
                    <div className="px-5 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            {job.title}
                          </h2>

                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-sm text-blue-100">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-sm text-blue-100">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.type}</span>
                            </div>

                            <div className="text-sm text-blue-100">
                              <span>{job.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <span className="inline-flex items-center px-3 py-2 bg-white/15 border border-white/20 text-white rounded-lg text-sm font-medium backdrop-blur-sm">
                            {applications.length} Application
                            {applications.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Application List */}
                    <div className="mt-4">
                      <div className="divide-y divide-gray-100">
                        {applications.map((application) => (
                          <div
                            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-5 bg-white hover:bg-gray-50 transition-colors duration-200"
                            key={application.id}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              {/* Avatar */}
                              <div className="shrink-0">
                                {application.applicant.avatar ? (
                                  <img
                                    src={application.applicant.avatar}
                                    alt={application.applicant.name}
                                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                                    <span className="text-sm font-semibold text-white">
                                      {getInitials(application.applicant.name)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Applicant Info  */}
                              <div className="min-w-0">
                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                  {application.applicant.name}
                                </h3>

                                <p className="text-sm text-gray-500 truncate mt-0.5">
                                  {application.applicant.email}
                                </p>

                                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>
                                    Applied{" "}
                                    {moment(application.createdAt)?.format(
                                      "Do MM YYYY",
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <StatusBadge status={application.status} />
                              <button
                                onClick={() =>
                                  handleDownloadResume(
                                    application.applicant.resume,
                                  )
                                }
                                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                              >
                                <Download className="h-4 w-4" />
                                Resume
                              </button>

                              <button
                                onClick={() =>
                                  setSelectedApplicant(application)
                                }
                                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
                              >
                                <Eye className="h-4 w-4" />
                                View Profile
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* Profile Modal */}
        {selectedApplicant && (
          <ApplicantProfilePreview
            selectedApplicant={selectedApplicant}
            setSelectedApplicant={setSelectedApplicant}
            handleDownloadResume={handleDownloadResume}
            handleClose={() => {
              setSelectedApplicant(null);
              fetchApplications();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicationViewer;
