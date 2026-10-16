import { Download, X } from "lucide-react";
import { useState } from "react";
import { getInitials } from "../../utils/helper";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

import StatusBadge from "../StatusBadge";
const statusOptions = ["Applied", "In Review", "Rejected", "Accepted"];

const ApplicantProfilePreview = ({
  selectedApplicant,
  setSelectedApplicant,
  handleDownloadResume,
  handleClose,
}) => {
  const [currentStatus, setCurrentStatus] = useState(selectedApplicant.status);
  const [loading, setLoading] = useState(false);

  const onChangeStatus = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(selectedApplicant._id),
        { status: newStatus },
      );

      if (response.status === 200) {
        //Update local storage after successfully update
        setSelectedApplicant({ ...selectedApplicant, status: newStatus });
        toast.success("Applications status update successfully");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      //Optionally revert status if failure
      setCurrentStatus(selectedApplicant.status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Applicant Profile
          </h3>

          <button
            onClick={() => handleClose()}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-8">
          <div className="text-center">
            {selectedApplicant.applicant.avatar ? (
              <img
                src={selectedApplicant.applicant.avatar}
                alt={selectedApplicant.applicant.name}
                className="h-24 w-24 mx-auto rounded-full object-cover border-4 border-blue-100 shadow-md"
              />
            ) : (
              <div className="h-24 w-24 mx-auto rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-white">
                  {getInitials(selectedApplicant.applicant.name)}
                </span>
              </div>
            )}

            <h4 className="mt-4 text-xl font-bold text-gray-900">
              {selectedApplicant.applicant.name}
            </h4>

            <p className="mt-1 text-sm text-gray-500">
              {selectedApplicant.applicant.email}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div>
                <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Applied Postition
                </h5>
                <p className="text-base font-semibold text-gray-900">
                  {selectedApplicant.job.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedApplicant.job.location} •{" "}
                  {selectedApplicant.job.type}
                </p>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-200">
                <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Application Details
                </h5>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <StatusBadge status={currentStatus} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Applied Date:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {moment(selectedApplicant.createdAt)?.format(
                        "Do MM YYYY",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                handleDownloadResume(selectedApplicant.applicant.resume)
              }
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </button>

            {/* Status Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Change Application Status
              </label>

              <select
                value={currentStatus}
                onChange={onChangeStatus}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              {loading && (
                <p className="text-xs text-blue-600 mt-1">Updating status...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfilePreview;
