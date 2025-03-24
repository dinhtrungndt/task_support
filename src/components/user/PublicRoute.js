import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/start/AuthContext";

const PublicRoute = () => {
  const { user } = useContext(AuthContext);

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
