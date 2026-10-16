import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  userRole,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Profile button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
      >
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-lg object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 font-semibold">
              {companyName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Name + role */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-900">{companyName}</p>

        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {/* User information */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{companyName}</p>

            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>

          {/* View Profile */}
          <button
            onClick={() =>
              navigate(
                userRole === "jobseeker" ? "/profile" : "/company-profile",
              )
            }
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            View Profile
          </button>

          {/* Sign out */}
          <div className="border-t border-gray-100">
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
