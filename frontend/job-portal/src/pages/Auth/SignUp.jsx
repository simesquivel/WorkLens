import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { validateEmail } from "../../utils/helper";
import { validateAvatar } from "../../utils/helper";
import { validatePassword } from "../../utils/helper";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    avatarPreview: null,
    success: false,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clearing error when user starts typing
    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: "" },
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    if (formState.errors.role) {
      setFormState((prev) => ({
        ...prev,
        error: { ...prev.errors, role: "" },
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateAvatar(file);
      if (error) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, avatar: error },
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, avatar: file }));

      //Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState((prev) => ({
          ...prev,
          avatarPreview: e.target.result,
          errors: { ...prev.errors, avatar: ""},
        }))
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {
      fullName: !formData.fullName ? "Enter full name" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: !formData.role ? "Please select a role" : "",
      avatar: "",
    };

    //Remove empty errors
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validateForm()) return;

    setFormState((prev) => ({ ...prev, loading: true }));

    try {
      let avatarUrl = "";

      //upload image if present
      if (formData.avatar) {
        const imgUploadRes = await uploadImage(formData.avatar);
        avatarUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: avatarUrl || "",
      });

      //handle successful registration
      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {},
      }));

      const { token } = response.data;

      if(token) {
        login(response.data, token);

        //redirect based on role
        setTimeout(() => {
          window.location.href = 
            formData.role === "employer"
              ? "/employer-dashboard"
              : "/find-jobs";
        }, 2000);
      }

    } catch (error) {
      console.log("error", error);

      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            error.response?.data?.message ||
            "Registeration failed. Please try again."
        },
      }))
    }
  };

  // Success screen
  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Created!
          </h2>

          <p className="text-gray-600 mb-4">
            Welcome to JobPortal! Your account has been successfully created.
          </p>

          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />

          <p className="text-sm text-gray-500 mt-2">
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>

          <p className="text-sm text-gray-600">
            Join thousands of professionals finding their dream jobs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.errors.fullName
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter your full name"
              />
            </div>

            {formState.errors.fullName && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.fullName}
              </p>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.errors.email ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter your email"
              />
            </div>

            {formState.errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.email}
              </p>
            )}
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  formState.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Create a strong password"
              />

              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {formState.errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.password}
              </p>
            )}
          </div>
          {/* Avatar Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture <span className="text-gray-400">(Optional)</span>
            </label>

            <div className="flex items-center gap-5 p-4 border border-gray-200 rounded-xl bg-gray-50">
              {/* Avatar Preview */}
              <div className="w-20 h-20 shrink-0 rounded-full bg-linear-to-br from-blue-100 to-purple-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                {formState.avatarPreview ? (
                  <img
                    src={formState.avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-9 h-9 text-blue-500" />
                )}
              </div>

              {/* Upload Section */}
              <div className="flex-1">
                <input
                  type="file"
                  id="avatar"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <label
                  htmlFor="avatar"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </label>

                <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
              </div>
            </div>

            {formState.errors.avatar && (
              <p className="flex items-center gap-1.5 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                {formState.errors.avatar}
              </p>
            )}
          </div>
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              I am a <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Job Seeker */}
              <button
                type="button"
                onClick={() => handleRoleChange("jobseeker")}
                className={`p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                  formData.role === "jobseeker"
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                }`}
              >
                <UserCheck
                  className={`w-7 h-7 mb-3 ${
                    formData.role === "jobseeker"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                />

                <div
                  className={`font-semibold ${
                    formData.role === "jobseeker"
                      ? "text-blue-700"
                      : "text-gray-800"
                  }`}
                >
                  Job Seeker
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  Looking for opportunities
                </div>
              </button>

              {/* Employer */}
              <button
                type="button"
                onClick={() => handleRoleChange("employer")}
                className={`p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                  formData.role === "employer"
                    ? "border-purple-500 bg-purple-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/40"
                }`}
              >
                <Building2
                  className={`w-7 h-7 mb-3 ${
                    formData.role === "employer"
                      ? "text-purple-600"
                      : "text-gray-500"
                  }`}
                />

                <div
                  className={`font-semibold ${
                    formData.role === "employer"
                      ? "text-purple-700"
                      : "text-gray-800"
                  }`}
                >
                  Employer
                </div>

                <div className="text-sm text-gray-500 mt-1">Hiring talent</div>
              </button>
            </div>

            {formState.errors.role && (
              <p className="flex items-center gap-1.5 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                {formState.errors.role}
              </p>
            )}
          </div>
          {/* Submit Error */}
          {formState.errors.submit && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formState.errors.submit}
              </p>
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={formState.loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-blue-600 hover:text-purple-600 transition-colors"
              >
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
