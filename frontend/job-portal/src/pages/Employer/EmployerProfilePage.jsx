import { useState, useEffect } from "react";
import { Building2, Mail, Edit3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import EditProfileDetails from "./EditProfileDetails";

import DashboardLayout from "../../components/layout/DashboardLayout";

const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || "",
  });

  const [formData, setFormData] = useState({ ...profileData });

  useEffect(() => {
    if (user) {
      const updatedProfile = {
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        companyLogo: user.companyLogo || "",
      };

      setProfileData(updatedProfile);
      setFormData(updatedProfile);
    }
  }, [user]);

  const [editMode, setEditMode] = useState(false);

  const [uploading, setUploading] = useState({ avatar: false, logo: false });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const imageUploadRes = await uploadImage(file);
      const avatarUrl = imageUploadRes.imageUrl || "";

      // Update form data with new image url
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, avatarUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      //Create preview URL
      const previewUrl = URL.createObjectURL(file);
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, previewUrl);

      //upload img
      handleImageUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData,
      );

      if (response.status === 200) {
        toast.success("Profile Details Updated Successfully!");
        //Update profile data and exit edit mode
        setProfileData({ ...formData });
        updateUser({ ...formData });
        setEditMode(false);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditMode(false);
  };

  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
      />
    );
  }

  return (
    <DashboardLayout activeMenu="company-profile">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-5 sm:px-8">
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-semibold text-white">
                  Employer Profile
                </h1>

                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg border border-blue-400 hover:bg-blue-700 transition-colors duration-200"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-6 py-8 sm:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">
                    Personal Information
                  </h2>

                  {/* Avatar and Name */}
                  <div className="flex items-center gap-5 mt-6">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Avatar"
                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-xl font-semibold text-white">
                          {profileData.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profileData.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{profileData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200">
                    Company Information
                  </h2>

                  {/* Company Logo and Name */}
                  <div className="flex items-center gap-5 mt-6">
                    {profileData.companyLogo ? (
                      <img
                        src={profileData.companyLogo}
                        alt="Company Logo"
                        className="h-16 w-16 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-blue-600" />
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profileData.companyName || "Company"}
                      </h3>

                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span>Company</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6">
                  About Company
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg">
                  {profileData.companyDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;
