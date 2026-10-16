import { Save, X } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import uploadImage from "../../utils/uploadImage";

const EditProfileDetails = ({
  formData,
  handleImageChange,
  handleInputChange,
  handleSave,
  handleCancel,
  saving,
  uploading,
}) => {
  return (
    <DashboardLayout activeMenu="company-profile">
      {formData && (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-blue-600 px-6 py-5 sm:px-8">
                <h1 className="text-xl sm:text-2xl font-semibold text-white">
                  Edit Profile
                </h1>
              </div>

              {/* Edit Form */}
              <div className="px-6 py-8 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Personal Info */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-400">
                      Personal Information
                    </h2>

                    {/* Avatar Upload */}
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img
                          src={formData?.avatar}
                          alt="Avatar"
                          className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                        />

                        {uploading?.avatar && (
                          <div className="absolute inset-0 rounded-full bg-white/70 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors">
                            Choose file
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, "avatar")}
                            className="hidden"
                          />
                        </label>

                        <span className="ml-3 text-sm text-gray-500">
                          No file chosen
                        </span>
                      </div>
                    </div>

                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="block w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>

                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="block w-full px-4 py-3 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-400">
                      Company Information
                    </h2>

                    {/* Company Logo */}
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img
                          src={formData.companyLogo}
                          alt="Company Logo"
                          className="h-20 w-20 rounded-lg object-cover border-2 border-gray-200"
                        />

                        {uploading.logo && (
                          <div className="absolute inset-0 rounded-lg bg-white/70 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full hover:bg-emerald-100 transition-colors">
                            Choose file
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, "logo")}
                            className="hidden"
                          />
                        </label>

                        <span className="ml-3 text-sm text-gray-500">
                          No file chosen
                        </span>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>

                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        className="block w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                        placeholder="Enter company name"
                      />
                    </div>

                    {/* Company Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description
                      </label>

                      <textarea
                        value={formData.companyDescription}
                        onChange={(e) =>
                          handleInputChange(
                            "companyDescription",
                            e.target.value,
                          )
                        }
                        rows={4}
                        className="block w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                        placeholder="Describe your company..."
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 pt-6 border-t border-gray-400 flex justify-end items-center gap-3">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving || uploading.avatar || uploading.logo}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg border border-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EditProfileDetails;
