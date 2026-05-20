

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/context";
import { BarLoader } from "react-spinners";

function RequireAuth({ children }) {
  const navigate = useNavigate();

  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate("/auth");
  }, [isAuthenticated, loading]);

  if (loading) return <BarLoader width={"100%"} color="#c41e3a" />;

  if (isAuthenticated) return children;
}

export default RequireAuth;
