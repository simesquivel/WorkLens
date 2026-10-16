import { useEffect, useState } from "react";
import { Save, X, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    resume: user?.resume || "",
  });

  const [selectedResume, setSelectedResume] = useState(null);

  const [formData, setFormData] = useState({ ...profileData });
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
      const imgUploadRes = await uploadImage(file);
      const avatarUrl = imgUploadRes.imageUrl || "";

      // Update form data with new image URL
      handleInputChange(type, avatarUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      handleInputChange(type, previewUrl);

      // Upload image
      handleImageUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(false);
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData,
      );

      if (response.status === 200) {
        toast.success("Profile Details Updated Successfully!!");
        // Update profile data and exit edit mode
        setProfileData({ ...formData });
        updateUser({ ...formData });
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
  };

  const DeleteResume = async () => {
    setSaving(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.DELETE_RESUME, {
        resumeUrl: user.resume || "",
      });

      if (response.status === 200) {
        toast.success("Resume Deleted Successfully!!");
        setProfileData({ ...formData, resume: "" });
        updateUser({ ...formData, resume: "" });
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const userData = {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    };

    setProfileData({ ...userData });
    setFormData({ ...userData });
    return () => {};
  }, [user]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/70 via-white to-purple-50/50">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <div className="p-5 sm:p-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-gray-100 pb-5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Profile
                </h1>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 sm:p-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <div className="flex w-full flex-col items-center gap-5 sm:w-auto">
                    <div className="relative">
                      <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-blue-50 shadow-md ring-1 ring-gray-200 sm:h-32 sm:w-32">
                        <img
                          src={formData?.avatar}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />

                        {uploading?.avatar && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                        <span className="text-sm font-medium">
                          Choose avatar
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "avatar")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Name input */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                      disabled
                      value={formData.email}
                    />
                  </div>

                  {/*Resume */}
                  {user?.resume ? (
                    <div>
                      <label className="block text-sm font-medium">Resume</label>

                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">
                          Link:{" "}
                          <a href={user?.resume} className="text-blue-500 underline cursor-pointer" target="_blank">
                            {user?.resume}
                          </a>
                        </p>

                        <button className="cursor-pointer" onClick={DeleteResume}>
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block">
                        <span className="sr-only">Choose File</span>
                        <input
                          type="file"
                          onChange={(e) => handleImageChange(e, "resume")}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                  <Link
                    onClick={handleCancel}
                    to="/find-jobs"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </Link>
                  <button
                    onClick={handleSave}
                    disabled={saving || uploading.avatar || uploading.logo}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {saving ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
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
      </div>
    </div>
  );
};

export default UserProfile;
