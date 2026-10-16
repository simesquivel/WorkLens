import { Briefcase } from "lucide-react";

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>

                    <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin">
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <Briefcase className="w-7 h-7 text-blue-600" />
                    </div>
                </div>

                <p className="text-sm font-medium text-gray-600">
                    Finding amazing opportunities...
                </p>
            </div>
        </div>
    )
}

export default LoadingSpinner