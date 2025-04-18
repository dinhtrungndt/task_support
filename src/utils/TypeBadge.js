export const getTypeBadge = (type) => {
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