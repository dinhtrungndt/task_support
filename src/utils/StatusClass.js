import { CheckCircle, XCircle } from "lucide-react";

export const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "done":
    case "active":
      return "bg-green-100 text-green-800 border border-green-200";
    case "pending":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "rejected":
    case "inactive":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

export const getServiceData = (type) => {
  switch (type) {
    case "Data":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "Cloud":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case "Network":
      return "bg-green-100 text-green-800 border border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

export const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "done":
    case "active":
      return <CheckCircle size={12} className="mr-1" />;
    case "pending":
      return <div className="w-2 h-2 bg-amber-500 rounded-full mr-1.5"></div>;
    case "rejected":
    case "inactive":
      return <XCircle size={12} className="mr-1" />;
    default:
      return <div className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></div>;
  }
};

